# pi-relay-controller

A nodeJS HTTP server to control Raspberry Pi GPIO's outputs, for applications such as light automation

This is a simple application that can be installed in a Raspberry Pi to remotely control the relays in a Relay Channel.

The application provides a RESTFul API to display the available devices (for instance light bulbs in a house) and allows the user to toggle the devices.

It also provides a very simple webpage to do the same controls you can do through the API. 

API URLs:
 - http://<pi_address>:8080/api/devices - See all the devices amd theirs current status 
 - http://<pi_address>:8080/api/devices/:device_id - Toggle a device

Web Application URL:
 - http://<pi_address>:8080/
 
 This project is being tested with Raspberry Pi Model A, but it should work fine with Model B.
 
