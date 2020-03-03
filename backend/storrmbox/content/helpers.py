import cProfile
import threading


def raise_(ex):
    raise ex


class Parser:
    types = [
        (int, int),
        (float, float),
        (bool, lambda b: b.lower() == "true" if b.lower() in ["false", "true"] else raise_(ValueError))
        # (datetime, lambda value: datetime.strptime(value, "%Y/%m/%d"))
    ]

    def __init__(self, none_text, delimeter=' '):
        self.none_text = none_text
        self.delimeter = delimeter

    def split(self, text, *types):
        values = text.rstrip('\n').split(self.delimeter)
        for i, t in enumerate(types):
            values[i] = t(values[i]) if values[i] != self.none_text else None

        return values

    def get_column(self, text, index=0):
        return text.split(self.delimeter, index + 1)[index]

    @staticmethod
    def cast_to_correct_type(value):
        for typ, test in Parser.types:
            try:
                return test(value)
            except ValueError:
                continue
        return value

    @staticmethod
    def get_correct_type(value):
        for typ, test in Parser.types:
            try:
                test(value)
                return typ
            except ValueError:
                continue
        return str

    @staticmethod
    def normalize_value(value, none_value):
        if value != none_value:
            return Parser.cast_to_correct_type(value)
        return None

    @staticmethod
    def _recurse_normalize_dict(dct, none_value):
        for key, value in dct.items():
            if isinstance(value, dict):
                dct[key] = Parser._recurse_normalize_dict(value, none_value)
            elif isinstance(value, list):
                if len(value) != 0:
                    for i, v in enumerate(value):
                        if isinstance(v, (dict, list)):
                            dct[key][i] = Parser._recurse_normalize_dict(v, none_value)
                        else:
                            dct[key][i] = Parser.normalize_value(v, none_value)
            else:
                dct[key] = Parser.normalize_value(value, none_value)
        return dct

    @staticmethod
    def normalize_dict(_dict, none_value=""):
        return Parser._recurse_normalize_dict(_dict, none_value)


class DatasetReader:

    def __init__(self, filename, parser, key_index=0, skip_header=True, *types):
        self.filename = filename
        self.key_index = key_index
        self.key_value_cache = {}
        self.types = types
        self.skip_header = skip_header

        if isinstance(parser, Parser):
            self.parser = parser
        else:
            raise Exception(f"{type(parser)} is not a parser object!")

        self.file = open(filename, "rt", encoding="utf-8")
        self._prefetch()

    def __del__(self):
        self.file.close()

    def set_types(self, *types):
        self.types = types

    def _prefetch(self):
        offset = 0
        self.file.seek(0)

        if self.skip_header:
            offset += len(self.file.readline().encode("utf-8"))

        for line in self.file:
            self.key_value_cache[self.parser.get_column(line, self.key_index)] = offset

            offset += len(line.encode("utf-8"))

    def get_line(self, key):
        if key in self.key_value_cache:
            self.file.seek(self.key_value_cache[key])
            return self.file.readline()
        else:
            return None

    def get_data(self, key):
        line = self.get_line(key)

        if line:
            return self.parser.split(line, *self.types)
        else:
            return [None] * len(self.types)

    def iterate_data(self):
        self.file.seek(0)

        if self.skip_header:
            self.file.readline()

        for line in self.file:
            yield self.parser.split(line, *self.types)

    def remove_data(self, key):
        if key in self.key_value_cache:
            del self.key_value_cache[key]

    def has_key(self, key):
        return key in self.key_value_cache


class DatasetDiffReader(DatasetReader):
    # TODO
    def __init__(self, filename, parser, *types):
        super().__init__(filename, parser, *types)


class ProfiledThread(threading.Thread):
    # Overrides threading.Thread.run()
    def run(self):
        profiler = cProfile.Profile()
        try:
            return profiler.runcall(threading.Thread.run, self)
        finally:
            profiler.dump_stats('myprofile-%d.profile' % (self.ident,))
