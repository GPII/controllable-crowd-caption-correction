# Controllable Crowd Caption Correction (CCCC)

The CCCC uses crowd-sourced listeners and correctors, who read a real-time transcript that is being generated either from the professional captioner or an alternative source (e.g. Google Automatic Speech Recognition ) 

Consider a scenario where captions are being generated for a teleconference. A room has been set up for the meeting [here] (http://ccc.raisingthefloor.org/ccc/cccentry.php).

Correctors can login to the room [here](http://ccc.raisingthefloor.org/ccc/login.html)
Default pwd is 123. (this will change soon.)

A step by step demo of the CCCC is as follows (from Perkins and Vandeheiden 2012):

1. One of the captions reads: “an electronic key also notice a token”. This clearly does not make sense, but a deaf person can’t determine if this is an error, or if they just don’t understand and if it was an error, what was said.
2. An (authorized) meeting participant notices the captions do not match what was said and clicks on the text to correct it, which opens (only on their display) an editing box. The participant can then correct it. 
3. The participant replaces the incorrect word “notice” with the correct phrase “known as”. The participant presses the Enter key to indicate that edits are complete.
4. Lastly, the corrected text is shown highlighted in red and underlined to everyone, to indicate that the word has been corrected from its original state.

# Server installation

CCCC uses [Resin](http://caucho.com/) as Java EE and PHP application container. These are two ways to install CCCC:

## Using a Docker container

This is the easier and more secure method to install the application. [Docker](http://docker.io) must be installed and running in the server.

Follow the steps that you can find in [Docker-CCCC source container](https://github.com/gpii-ops/docker-cccc#how-to-deploy-the-container)

## Manual installation

If you don't want to use Docker containers, you can install the application with the following steps:

1. Install Resin.

  Follow the steps documented in [Resin Installation Quick Start](http://www.caucho.com/resin-4.0/admin/starting-resin.xtp)
2. Configure Resin

  ```
sed -e "s|^web_admin_enable .*$|web_admin_enable : false|" \
    -e "s|^dev_mode .*$|dev_mode : false|" \
    -e "s|^dev_mode .*$|dev_mode : false|" \
    -i /etc/resin/resin.properties
  ```

3. Copy the code

  ```
  cp $SOURCE_DIR/* /var/resin/webapps/ROOT/
  ```
4. Set up the admin password

  ```
  CCC_PASSWORD="secretpassword"
  find /var/resin/webapps/ROOT -name *.php -type f -print0 | xargs -0 sed -i "s/password1234567890/${CCC_PASSWORD}/g"
  find /var/resin/webapps/ROOT -name *.java -type f -print0 | xargs -0 sed -i "s/password1234567890/${CCC_PASSWORD}/g"

  chown resin:resin -R /var/resin/webapps
  chown resin:resin -R /var/resin/webapp-jars
  ```

7. Start Resin

  By default, Resin server listen on port 8080

# Testing and development

You must have installed [VirtualBox](https://www.virtualbox.org/wiki/Downloads) and [Vagrant](http://www.vagrantup.com/downloads.html) applications in your PC.

Follow the documented steps that you can find in [Docker-CCCC source container](https://github.com/gpii-ops/docker-cccc#development-and-testing)

