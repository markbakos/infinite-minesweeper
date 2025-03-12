package utils

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestPasswordHashingAndVerification(t *testing.T) {
	password := "secure_password123"

	hash, err := HashPassword(password)
	assert.NoError(t, err)
	assert.NotEmpty(t, hash)
	assert.NotEqual(t, password, hash)

	match := CheckPasswordHash(password, hash)
	assert.True(t, match, "Password verification should succeed with correct password")

	match = CheckPasswordHash("wrong_password", hash)
	assert.False(t, match, "Password verification should fail with incorrect password")
}

func TestEmptyPasswordHandling(t *testing.T) {
	emptyPassword := ""
	hash, err := HashPassword(emptyPassword)

	assert.NoError(t, err)
	assert.NotEmpty(t, hash)

	match := CheckPasswordHash(emptyPassword, hash)
	assert.True(t, match)

	emptyMatch := CheckPasswordHash("", hash)
	assert.True(t, emptyMatch)
}
