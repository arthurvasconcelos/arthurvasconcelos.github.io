.PHONY: deploy clean new repos

print = @echo "=> $(1)"\
				"\n-----------------------"

dasherize  = $(shell echo $(strip $(1)) | tr ' [A-Z]-' '-[a-z]-')
createPost = $(shell sed 's/{TITLE}/$(strip $(2))/g' "blog/_template.md" > "blog/$(strip $(1)).md")

deploy:
	make clean

	$(call print, "Compile site")
	harp compile

	$(call print, "Checkout master branch")
	git checkout master

	$(call print, "Clean unwanted files and folders")
	rm -rf www/.git www/.gitignore
	cp -r www/ ./
	make clean

	$(call print, "Commit changes to master")
	git add .
	git commit -m ":rocket: deploy website"
	git push origin master

	$(call print, "Go back to source")
	git checkout source

clean:
	rm -rf www > /dev/null

new:
ifeq ($(post),)
	@echo Qual nome do novo post? Ex: make new post="Meu novo post"
else
	$(call print, "Novo post: $(post)")
	$(call createPost, $(call dasherize, $(post)), $(post))
endif

repos:
	node _repos.js
