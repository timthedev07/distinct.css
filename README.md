<h1 align="center">
  <img src="logo.svg" width="70%">
</h1>

## About

A command line app for finding and removing duplicate or conflicting css rules in a given file or directory.

## Installation

Install globally:

```bash
yarn global add distinct.css
```

Install as a dev dependency for your project:

```bash
yarn add -D distinct.css
```

## Get Started

```bash
distinct.css -f [file/directory]
```

## Command Line Usage

```
Usage: distinct.css -f [path]

Options:
  -f, -d, --file, --directory  File/directory to check       [string] [required]
  -c, --showConflict           Show conflicting rules [boolean] [default: false]
  -h, --help                   Show help                               [boolean]
  -v, --version                Show version number                     [boolean]

Example:
  distinct.css -f button.css  - searches for duplicate css rules in file button.css
  distinct.css -f css/  - searches for duplicate css rules in the css directory
  distinct.css -c -f iHaveConflicts.css  - searches for duplicate and conflicting css rules in the iHaveConflicts.css
```
