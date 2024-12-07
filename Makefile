default:
	git tag $$(git rev-parse --short HEAD)
	git push --tags -fv
	git push