.PHONY: test
test:
	go test ./... -v

.PHONY: test-cover
test-cover:
	go test ./... -coverprofile=coverage.out && go tool cover -html=coverage.out

.PHONY: test-race
test-race:
	go test ./... -race

.PHONY: mock-gen
mock-gen:
	mockery --dir=./... --all
