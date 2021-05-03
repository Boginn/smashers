<template>
  <v-container>
    <v-row v-if="!toon.pacifist">
      <div
        v-for="w in inventory"
        v-bind:key="w.name"
        class="d-flex justify-center"
      >
        <v-btn
          class="weapon"
          @click="$emit('changeWeapon', w)"
          small
          outlined
          v-bind:class="{ highlight: selectedWeapon.name == w.name }"
        >
          {{ w.name }} <span v-if="w.uses">({{ w.uses }}/{{ w.maxUses }})</span>
        </v-btn>
      </div>
    </v-row>
    <v-row v-else>
      <img
        style="margin-bottom: 5px;"
        height="50px"
        src="../assets/cross.png"
        alt="cross"
      />
      <input
        class="fontshadow"
        type="text"
        v-model="input"
        placeholder="Recite..."
        :disabled="lockMove"
        v-on:keyup="sendInput"
      />
      <v-btn
        class="yellow--text fontshadow attack-bg"
        height="50"
        block
        :disabled="lockMove"
        v-bind:class="{ disbld: lockMove }"
        @click="$emit('preach', input); input = ''"
        >PREACH</v-btn
      >
    </v-row>
  </v-container>
</template>

<script>
export default {
  props: {
    inventory: Array,
    selectedWeapon: Object,
    toon: Object,
    lockMove: Boolean,
  },
  computed: {},
  methods: {
    sendInput(e) {
            if (e.keyCode === 13) {
              this.$emit("preach", this.input);
      this.input = "";
      }
    },
  },
  data: function() {
    return {
      input: "",
    };
  },
};
</script>

<style scoped>
.weapon {
  width: 150px;
  color: rgb(229, 236, 172);
}
.highlight {
  background-color: rgba(0, 255, 255, 0.281);
}
::placeholder {
  color: white;
}
input {
  border-radius: 10px;
  padding-left: 10px;
  color: white;
  width: 90%;
}
input:active,
input:focus {
  outline: none;
  border: none;
}
.attack-bg {
  background: linear-gradient(
    120deg,
    rgba(202, 189, 3, 0.95) -60%,
    rgba(196, 54, 54, 0.95) 30%
  );
}
.disbld {
  background: grey;
  font-size: 0;
}
</style>
