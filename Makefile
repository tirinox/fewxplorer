.PHONY: deploy build dev upload

include .env
export

dev:
	yarn run dev

build:
	vite build

upload:
	@echo Uploading to $(SFTP_HOST)
	#scp -r -p "$(SFTP_PASSWORD)" "./dist" "$(SFTP_USER)@$(SFTP_HOST):$(SFTP_PORT)$(SFTP_PATH)"
	rsync -r -v --progress -e ssh "./dist" "$(SFTP_USER)@$(SFTP_HOST):$(SFTP_PORT)$(SFTP_PATH)"

deploy:
	$(MAKE) build
	$(MAKE) upload
	open "https://fewmans.xyz"

