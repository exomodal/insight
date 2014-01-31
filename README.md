KPI Tooling
=======

version: 0.1  
release: boilerplate  

##################################
## Deploying on eXomodal server ##
##################################

$ meteor deploy kpitooling.tgz  
$ scp -P 1001 kpitooling.tgz user@127.0.0.1:/home/user/kpitooling.tgz  
$ ssh -l user -p 1001 127.0.0.1  
user@127.0.0.1: $ sudo mv /home/user/kpitooling.tgz /opt/kpitooling/kpitooling.tgz  