<template>
  <v-container>
      <v-row>
        <div v-for="w in inventory" v-bind:key="w.name" class="d-flex justify-center">
          <v-btn
          class="weapon"
          @click="$emit('changeWeapon', w)"
          small
          outlined
           v-bind:class="{ highlight: selectedWeapon.name == w.name }" >

            {{w.name}} <span v-if="w.uses">({{w.uses}}/{{w.maxUses}})</span>
          </v-btn>
        </div>
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

<style scoped>
.weapon {
  width: 150px;

}
</style>