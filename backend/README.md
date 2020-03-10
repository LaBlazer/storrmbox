## storrmbox backend
### Installation
1. Download and install python 3.7+, pip, pipenv, Deluge 2+, Postgresql
2. `pipenv install`
3. `pipenv run serve`
4. Terminate
5. Edit `config.yml`
6. `pipenv run serve`

### Creating user
1. `pipenv shell`
2. `python manage.py createuser <username> <password> <permission level 0-2>`
