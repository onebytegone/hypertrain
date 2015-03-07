<?php

/**
 *
 *
 * @copyright 2015 Ethan Smith
 */
class Player {
   function __construct($data = null) {
      if (!$data) {
         $data = array();
         $data['id'] = uniqid();
      }

      $this->playerData = $data;
   }

   public function getData() {
      return $this->playerData;
   }
}
