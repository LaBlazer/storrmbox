from dotenv import load_dotenv

load_dotenv()  # Load .env file

import argparse
import subprocess
from threading import Thread


def output_reader(process):
    while True:
        output = process.stdout.readline()
        if output == '' and process.poll() is not None:
            break
        if output:
            print(output.strip())
    rc = process.poll()
    return rc


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Storrmbox')
    parser.add_argument('type', metavar='type', type=str,
                        help='type of deploy (prod*, dev)')
    parser.add_argument('-w', dest='workers', action='store',
                        type=int, default=4,
                        help='number of workers')

    args = parser.parse_args()

    print(args)

    # Run workers
    workers = subprocess.Popen(f'huey_consumer.py storrmbox.extensions.task_queue -w {args.workers}',
                               stdout=subprocess.PIPE, shell=True)
    Thread(target=output_reader,
           args=(workers,), daemon=True).start()

    # Run the server
    if args.type == "dev":
        backend = subprocess.Popen('manage.py runserver',
                                   stdout=subprocess.PIPE, shell=True)
        output_reader(backend)
        workers.kill()

    else:
        from storrmbox import create_app, config
        from waitress import serve

        app = create_app(config.ProdConfig)
        serve(app, host="127.0.0.1", port=5000)
