from dotenv import load_dotenv
load_dotenv()  # Load .env file

from storrmbox import create_app, config
from waitress import serve

# Run production server
if __name__ == "__main__":
    app = create_app(config.ProdConfig)
    serve(app, host="127.0.0.1", port=5000)