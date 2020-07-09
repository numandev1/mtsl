<p align="center">
  <img height="350" src="https://media.giphy.com/media/h4rDG45HDghxqzw5fF/giphy.gif">
</p>

> Make Tangible symlinks

Mtsl listens to changes in some folder (using [Chokidar](https://www.npmjs.com/package/chokidar)) and copies changed files into another folder.

## Working
Actually, it is watcher **CLI** that copy files from source to destination

## Why Mtsl not other packages?
There are other tangible symlink packages available but every package has so many bugs. famous package is [wml](https://github.com/wix/wml) but that have many bugs. This package is working as required

Let's face it, sometimes symbolic links just aren't enough. Github has more than [10K issues](https://github.com/search?utf8=✓&q=support+for+symlinks&type=Issues) with the words "support for symlinks" in them. 


Mtsl is a CLI tool that works pretty much like `ln -s [src] [dest]`. You first set up your links by using the `mtsl add -s [src] -d [dest]` command and then run the mtsl service (`mtsl start <linkId>`) to start listening. link index can be get from `mtsl list` That's it!

Note that since Mtsl is based on Chokidar it **does not support symlinks**. lol.

## Install

```sh
npm install -g mtsl
```

## Usage

```sh
# add the link to mtsl using `mtsl add -s <src> -d <dest>`
mtsl add -s ~/source-dir -d ~/User/destination-dir
```
###### output
Added link: (0) /Users/username/source-dir -> /Users/username/User/destination-dir
```
# above command will give you link id what will use to start watching link that is added
mtsl start 0
```

## Commands

#### add

`mtsl add -s <src> -d <dest>` 
(or `mtsl add -s <src> -d <dest> -skip-prompt`)

Adds a link.

mtsl will not start listening to changes until you start it by running `mtsl start <linkId>`.

Each link is given an unique id, you can see all links and their ids by running `mtsl list`.
Links are saved to `src/links.json` in your `mtsl` install directory, meaning that 
your configuration is specific to that `mtsl` install.

#### remove

`mtsl remove <linkId>`

Removes a link.

#### remove all

`mtsl removeall`

Removes all link that made by using `mtsl add`.

#### start

`mtsl start <linkId>`

Starts mtsl.

It first copies all watched files from source to destination folder and then waits for new changes to happen.

#### startwithoutadd

`mtsl startwithoutadd -s <src> -d <dest>`

Starts mtsl without add link.

it is same as `mtsl start` but it starts to make symlink without adding the link.

#### list

`mtsl list`

Lists all links.

Shows each link's id and source/destination folders.

## Miscellaneous

#### Ignored folders

When adding a new link Mtsl will try to detect if your source folder is a git repository or an npm package, it will then offer to ignore the ".git" and "node_modules" folders for you.

If you want to add more folders to your ignored folders first create a file named `.mtslconfig.json` in your source folder, this file should contain ignore directories for this folder which will not [CRUD](https://en.wikipedia.org/wiki/Create,_read,_update_and_delete) from source to destination.

In the following example we are ignoring the ".git" and "node_modules" folders:

```json
{
    "ignore_dirs": [
        ".git",
        "node_modules"
    ]
}
```

## Contributing

See the [Contributing page](CONTRIBUTING.md).

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore -->
<table>
  <tr>
    <td align="center"><a href="https://github.com/nomi9995"><img src="https://avatars3.githubusercontent.com/u/36044436?s=460&u=c7471cd9ccec793c7a0fccc7db475a577ff7969d&v=4" width="100px;" alt="Numan"/><br /><sub><b>Numan</b></sub></a><br /><a href="#infra-Numan" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a> <a href="https://github.com/nomi9995/mtsl/commits?author=nomi9995" title="Code">💻</a></td>
  </tr>
</table>

<!-- ALL-CONTRIBUTORS-LIST:END -->

## License

Copyright (c) 2020 Nomi9995. Licensed under the MIT license.
