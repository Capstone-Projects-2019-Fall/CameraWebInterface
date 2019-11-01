<template>
  <v-container class="home">
    <v-row>
      <v-col align="center">
        <h1>MSPi</h1>
      </v-col>
    </v-row>
    <v-row>
      <v-col class="md4">
      </v-col>
      <v-col class="md4">
        <v-img src="../assets/mspi.png"
          max-height="200px"
          contain
        ></v-img>
      </v-col>
      <v-col class="md4">
      </v-col>
    </v-row>
    
    <v-row>
      <v-col align="center">
        <v-card>
          <v-card-title>What is MSPi?</v-card-title>
          <v-card-text>
            <p>MSPi is a motion-capture security camera that provides users with live alerts as to what
      occurs within and around their home. The target audience for this device is mainly suburban
      and urban home owners as well as frequent Amazon shoppers. This device aims to protect
      against porch pirates and unwanted intruders by taking advantage of a miniature computer
      referred to as a Raspberry Pi. The Raspberry Pi will be loaded with Raspbian OS and run
      Python Scripts that utilize the OpenCV (Open Source Computer Vision) library. MSPi is
      mountable outside of the customer’s door, or anywhere within their home, and serves to detect
      human-body shaped motion. Furthermore, it uses facial recognition to identify frequent visitors
      such as users and their family members. The device will also be equipped with a microphone
      along with speakers to allow two-way communication between the customer those on-camera.
      Communication is facilitated using either a mobile application or a web application. The data is
      streamed from the user’s local network to Firebase via UV4L Audio/Video Streaming. We will
      then pull the data from Firebase to allow access from our web and mobile applications which in
      turn can fulfill other requirements such as sending emails and notifications.</p>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
