import cProfile
import threading


class Parser:

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
