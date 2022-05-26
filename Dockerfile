FROM ubuntu:latest

# getting list of available packages
RUN DEBIAN_FRONTEND="noninteractive" apt update 
#installing python dependencies
RUN DEBIAN_FRONTEND="noninteractive" apt install python3 python3-pip firefox tmux vim ffmpeg -y 
RUN python3 -m pip install --upgrade pip
RUN python3 -m pip install selenium tqdm flask webdriver-manager

# installing npm dependencies
RUN DEBIAN_FRONTEND="noninteractive" apt install npm curl -y 

# installing nodejs
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
RUN DEBIAN_FRONTEND="noninteractive" apt-get install -y nodejs

# export flask app variable
ENV FLASK_APP=server

#copying current directory contents into docker
WORKDIR /mediaplay

# expose flask server port
EXPOSE 5000/tcp
# expose react app port
EXPOSE 3000/tcp

CMD python3 backend/server.py& npm start && fg
# run the react app in the background
# ENTRYPOINT [ "tmux" ]
# RUN cd ../ && npm start

