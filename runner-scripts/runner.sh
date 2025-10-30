#!/bin/bash

set -e
set -o pipefail

LANGUAGE=$1
FILENAME=$2

if [ -z "$LANGUAGE" ] || [ -z "$FILENAME" ]; then
    echo "Usage: runner.sh <language> <filename>" >&2
    exit 1
fi

cd /job

if [ ! -f "$FILENAME" ]; then
    echo "Error: File $FILENAME not found" >&2
    exit 1
fi

if [ ! -f "input.txt" ]; then
    touch input.txt
fi

run_with_timeout() {
    timeout 5s "$@" < input.txt
    return $?
}

case "$LANGUAGE" in
    python)
        run_with_timeout python3 "$FILENAME"
        ;;
    c)
        gcc "$FILENAME" -o program -O2 -Wall -Wextra 2>&1 || { echo "Compilation failed" >&2; exit 1; }
        run_with_timeout ./program
        ;;
    cpp)
        g++ "$FILENAME" -o program -O2 -Wall -Wextra -std=c++17 2>&1 || { echo "Compilation failed" >&2; exit 1; }
        run_with_timeout ./program
        ;;
    java)
        CLASSNAME=$(basename "$FILENAME" .java)
        javac "$FILENAME" 2>&1 || { echo "Compilation failed" >&2; exit 1; }
        run_with_timeout java "$CLASSNAME"
        ;;
    javascript)
        run_with_timeout node "$FILENAME"
        ;;
    *)
        echo "Error: Unsupported language '$LANGUAGE'" >&2
        echo "Supported languages: python, c, cpp, java, javascript" >&2
        exit 1
        ;;
esac

exit $?


