<?php

/**
 *
 *
 * @copyright 2015 Ethan Smith
 */
class Director {

   public function getToken($payload) {
      if (!isset($payload['token']) || !$payload['token']) {
         return null;
      }

      $jwt = $payload['token'];
      $decoded = JWT::decode($jwt, TOKEN_SECRET);
      return (array) $decoded;
   }

   public function getCommand($payload) {
      if (!isset($payload['command'])) {
         return null;
      }

      return $payload['command'];
   }

   public function buildToken($tokenData) {
      return JWT::encode($tokenData, TOKEN_SECRET);
   }

   public function processRequest($payload) {
      $board = null;
      $player = null;

      $command = $this->getCommand($payload);
      $token = $this->getToken($payload);
      if (!$token) {
         // Is generate token command?
         if ($command == "sync") {
            $player = new Player();
         }else {
            // Don't know what is happening, throw error.
            return json_encode($this->generateError());
         }
      }

      return json_encode($this->generateResponse($player->getData()));
   }

   public function generateResponse($playerData) {
      return array(
         'status' => 'ok',
         'token' => $this->buildToken($playerData),
      );
   }

   public function generateError() {
      return array(
         'status' => 'error',
      );
   }
}
