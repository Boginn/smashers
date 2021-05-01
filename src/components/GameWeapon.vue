<template>
  <v-container>
      <v-row>
        <v-col v-for="w in inventory" v-bind:key="w.name">
          <v-btn
          @click="$emit('changeWeapon', w)"
          small
          outlined
           v-bind:class="{ highlight: selectedWeapon.name == w.name }" >

            {{w.name}} <span v-if="w.uses">({{w.uses}}/{{w.maxUses}})</span>
          </v-btn>
        </v-col>
<div></div>
      </v-row>
  </v-container>
</template>

<script>
export default {
props: {
  inventory: Array,
  selectedWeapon: Object,
},

}
</script>

<style>

</style>