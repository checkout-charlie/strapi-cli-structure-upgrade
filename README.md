# Strapi Schema Code Migration Script

This script covers _some_ parts of Upgrading Strapi from version 3 to 4, mainly focusing on updating the Schema/API related files. The goal is to reduce the tedious work of updating all model related files by hand and less to do more complicated work.

What is covered in this Script?

1. Routes
2. Controllers
3. Services
4. Content-type schema

All updates expect some default strapi patterns to be in place so please check the code carefully afterwards.

## Limitations

It is not clear what a `oneToOne` OR `manyToOne` is, so search the schema files for the marked `TODO` and chose wich one it is.

## Installation

```
yarn install
```

## Execution

```
yarn start
```