#!/bin/bash

echo "================================"
echo "FeeYangu Backend Test Suite"
echo "================================"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Run Unit Tests
echo "Running Unit Tests..."
php artisan test tests/Unit --testdox
if [ $? -ne 0 ]; then
    echo -e "${RED}Unit tests failed!${NC}"
    exit 1
fi
echo -e "${GREEN}Unit tests passed!${NC}"
echo ""

# Run Feature Tests
echo "Running Feature Tests..."
php artisan test tests/Feature --testdox
if [ $? -ne 0 ]; then
    echo -e "${RED}Feature tests failed!${NC}"
    exit 1
fi
echo -e "${GREEN}Feature tests passed!${NC}"
echo ""

# Run API Tests
echo "Running API Tests..."
php artisan test tests/Api --testdox
if [ $? -ne 0 ]; then
    echo -e "${RED}API tests failed!${NC}"
    exit 1
fi
echo -e "${GREEN}API tests passed!${NC}"
echo ""

# Code Coverage
echo "Generating Code Coverage Report..."
php artisan test --coverage --coverage-html=coverage/html
echo -e "${GREEN}Coverage report generated in coverage/html/index.html${NC}"
echo ""

echo -e "${GREEN}================================${NC}"
echo -e "${GREEN}All tests passed successfully!${NC}"
echo -e "${GREEN}================================${NC}"