---
layout: post
title: Install Ruby 2.x and Rails 5 on Ubuntu 18.04
author: luishck
date: 2018-07-18 00:00:03 -0600
categories: ruby rails ubuntu 18.04 Bionic Beaver
description: Setting up Ruby and Ruby on Rails invironment on Ubuntu 18.04
cover: ../assets/img/ubuntu-rails-installation.jpg
permalink: /posts/:title:output_ext
---
# Install dependencies
We need to install some stuff required by Ruby and Rails ecosystem.

## Install Ubuntu required packages

```bash
curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list

sudo apt-get update
sudo apt-get install git-core curl zlib1g-dev build-essential libssl-dev libreadline-dev libyaml-dev libsqlite3-dev sqlite3 libxml2-dev libxslt1-dev libcurl4-openssl-dev software-properties-common libffi-dev nodejs yarn
```

## Install Ruby Version Manager
Theres many methods to install Ruby on your PC. We will cover the most popular alternatives.
**Note:** Choose only one, can cause conflicts with each other:

### Install **rbenv** (Recomended)

```bash
cd
git clone https://github.com/rbenv/rbenv.git ~/.rbenv
echo 'export PATH="$HOME/.rbenv/bin:$PATH"' >> ~/.bashrc
echo 'eval "$(rbenv init -)"' >> ~/.bashrc
exec $SHELL

git clone https://github.com/rbenv/ruby-build.git ~/.rbenv/plugins/ruby-build
echo 'export PATH="$HOME/.rbenv/plugins/ruby-build/bin:$PATH"' >> ~/.bashrc
exec $SHELL

RUBY_CONFIGURE_OPTS=--disable-install-doc rbenv install 2.4.4
rbenv global 2.4.4
ruby -v
```

_Notice the flag: `RUBY_CONFIGURE_OPTS=--disable-install-doc` we are disabling the ruby internal documentation, this reduces the installation time a lot and not and it does't affect any ruby's ​​functionality_

### Install **RVM**

```bash
sudo apt-get install libgdbm-dev libncurses5-dev automake libtool bison libffi-dev
gpg --keyserver hkp://keys.gnupg.net --recv-keys 409B6B1796C275462A1703113804BB82D39DC0E3 7D2BAF1CF37B13E2069D6956105BD0E739499BDB
curl -sSL https://get.rvm.io | bash -s stable
source ~/.rvm/scripts/rvm
rvm install 2.4.4
rvm use 2.4.4 --default
ruby -v
```

### Install budler
Afert you are installed Rbenv or RVM, the las steep is install **bundler**

```bash
gem install bundler
```

_rbenv users need to run rbenv rehash after installing bundler._

# Install Rails
We can skip gem docs installation, this mades the installation faster.

Install a specific version:

```bash
gem install rails -v 5.2.0
```

Install the lasted aviable

```bash
gem install rails
```

If you're using rbenv, you'll need to run the following command to make the rails executable available:

```bash
rbenv rehash
```

Now that you've installed Rails, you can run the rails -v command to make sure you have everything installed correctly:

```bash
rails -v
# Rails 5.2.0
```

That's all 🙌

Next steeps:
+ Install PostgreSQL
+ Install MySQL
+ Install Visual Studio Code / Atom / Sublime Text