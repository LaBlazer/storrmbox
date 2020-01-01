import cProfile
import threading


class Parser:

    def __init__(self, none_text, delimeter = " "):
        self.none_text = none_text
        self.delimeter = delimeter

    def split(self, text, *types):
        values = text.rstrip("\n").split(self.delimeter)

        for i, v in enumerate(values):

            if v == self.none_text:
                values[i] = None
                continue

            if i < len(types):
                #t = types[i]

                #if t not in [int, str, float]:
                #    raise Exception(f"{type(t)} is not a primitive type!")

                values[i] = types[i](v)

        return values


class DatasetReader:

    def __init__(self, filename, parser, key_index=0, skip_header=True):
        self.filename = filename
        self.key_index = key_index
        self.key_value_cache = {}

        if isinstance(parser, Parser):
            self.parser = parser
        else:
            raise Exception(f"{type(parser)} is not a parser object!")

        self.file = open(filename, "rt", encoding="utf8")
        self._prefetch(skip_header)

    def __del__(self):
        self.file.close()

    def _prefetch(self, skip_header):
        offset = 0
        self.file.seek(0)

        for line in self.file:
            if offset != 0 or not skip_header:
                self.key_value_cache[self.parser.split(line)[self.key_index]] = offset

            offset += len(line.encode("utf8"))

    def get_line(self, key):
        if key in self.key_value_cache:
            self.file.seek(self.key_value_cache[key])
            return self.file.readline()
        else:
            return None

    def get_data(self, key, *types):
        line = self.get_line(key)

        if line:
            return self.parser.split(line, *types)
        else:
            return [None] * len(types)

    def iterate_data(self, *types):
        for offset in list(self.key_value_cache.values()):
            self.file.seek(offset)
            d = self.file.readline()
            yield self.parser.split(d, *types)

    def remove_data(self, key):
        if key in self.key_value_cache:
            del self.key_value_cache[key]

    def has_key(self, key):
        return key in self.key_value_cache


class ProfiledThread(threading.Thread):
    # Overrides threading.Thread.run()
    def run(self):
        profiler = cProfile.Profile()
        try:
            return profiler.runcall(threading.Thread.run, self)
        finally:
            profiler.dump_stats('myprofile-%d.profile' % (self.ident,))