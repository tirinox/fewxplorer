#!/bin/bash

yarn build

if [ -f .env ]
then
  export $(cat .env | sed 's/#.*//g' | xargs)
fi

sftp -i ~/.ssh/id_rsa "sftp://${SFTP_USER}@${SFTP_HOST}:${SFTP_PORT}" -b <<-END
  lcd dist
  cd /home/fewmzett/public_html
  put -r .
  bye
END
