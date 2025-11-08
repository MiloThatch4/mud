<script>
import { io } from "socket.io-client";

var socket = io();

export default {
  emits: ['countIsBig'],
  props: {
    msg: String,
  },
  data() {
    return {
      
    };
  },
  methods: {
    sendText() {
			socket.emit("sendChat", "this is a test message sent from a vue page");
			// this.inputText = "";
		},
  },
  mounted() {
  }
}
</script>

<template>

  <button @click="sendText">test</button>

  <!-- <h1>{{ msg }}</h1> -->
</template>
