JBrowse-PrimerDesigner
======================

About
-----
PrimerDesigner plugin for JBrowse
Written by Nathan Liles (nml5566@gmail.com)

PrimerDesginer designs primers for a highlighted region's DNA sequence.

This plugin is very alpha at the moment.

Prerequisites
-------------
# Bio::PrimerDesigner
Bio::PrimerDesigner is a perl module frontend for primer3. It can be installed
via CPAN
 sudo cpan Bio::PrimerDesigner

# primer3 (1.14 or older)
This legacy requirement is due to Bio::PrimerDesigner, which currently isn't 
compatible with anything newer.

The older versions can be found here:
 http://primer3.sourceforge.net/releases.php

*Note: if primer3 is installed anywhere other than the default $PATH, you'll
need to change the BINPATH constant in PrimerDesigner/bin/primer-designer.pl
to reflect that.


Installation
------------
First copy the PrimerDesigner/ folder into your JBrowse plugins/ directory 
 cp -r PrimerDesigner/ /your/jbrowse/path/plugins

Next, change permissions on a couple of paths so Apache can use them:

*Note: Make sure to substitute $APACHE_USER with the appropriate Apache user for your
OS (www-data for Linux & _www for OSX)

 cd /your/jbrowse/path/plugins/PrimerDesigner

 sudo chmod 764 bin/primer-designer.pl
 sudo chown $APACHE_USER bin/primer-designer.pl

 sudo chmod 764 tmp
 sudo chown $APACHE_USER tmp

Then, add the following to Apache's httpd.conf:

 <Directory /your/jbrowse/path/plugins/PrimerDesigner/bin>
     Options +ExecCGI
     AddHandler cgi-script .pl
 </Directory>

Make sure to reboot Apache after the change

Finally, edit JBrowse's jbrowse_conf.json and add PrimerDesigner to the plugin
list:
 plugins: [ 'PrimerDesigner' ],

If everything has gone well, you should see a PrimerDesigner pulldown option
in the menu
