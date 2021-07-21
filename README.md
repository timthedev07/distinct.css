<h1 align="center">
  <img src="logo.svg" width="70%">
</h1>
<p align="center">
  <img src="https://img.shields.io/npm/l/distinct.css?style=for-the-badge">
</p>

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
  -r, --recursive              Recursively search in a directory
                                                       [boolean] [default: true]
  -h, --help                   Show help                               [boolean]
  -v, --version                Show version number                     [boolean]

Examples:
  distinct.css -f button.css             - searches for duplicate css rules in file
                                     button.css
  distinct.css -r -f css/                - recursively searches for duplicate css
                                     rules in the css directory
  distinct.css -c -f iHaveConflicts.css  - searches for duplicate and conflicting
                                     css rules in iHaveConflicts.css
```
