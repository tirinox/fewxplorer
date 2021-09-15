.PHONY: deploy build dev upload

dev:
	yarn run dev

build:
	vite build

upload:
	@echo Uploading to $(SFTP_HOST)
	bash deploy.sh

deploy:
	$(MAKE) build
	$(MAKE) upload
	open "https://fewmans.xyz"

