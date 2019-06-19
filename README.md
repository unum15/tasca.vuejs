# Tasca VueJS

Tasca VueJS is a vuejs based frontend for tracking clients and scheduling for small contractors.
You will also need Tasca Lumen to provide the backend.
## Official Documentation

Documentation can be found on the [Github Wiki](https://github.com/unum15/tasca.vuejs/wiki).

Tasca VueJS is open-sourced software licensed under the [GPL 3 License](https://opensource.org/licenses/GPL-3.0)


#Install

git clone git@github.com:unum15/tasca.vuejs.git
cd tasca.vuejs
npm install
npm run build
sudo cp tasca.conf /etc/nginx/sites-available/
sudo ln -s /etc/nginx/sites-available/tasca.conf /etc/nginx/sites-enabled
This should be done in the webserver config but NGINX has some issues
ln -s documentroot/tasca.lumen/public/ tasca.vuejs/dist/api
