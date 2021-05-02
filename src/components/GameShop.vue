<template>
  <v-container>
    <v-row>
     <v-col>
        <div v-for="i in items" v-bind:key="i.name">
          <v-card>
          <v-btn class="button-bg" color="red lighten-1" block @click="buyItem(i)">
            <h3> {{ i.name }} |</h3>
            <h4> | {{ i.cost }} g</h4>
          </v-btn>
          </v-card>
        </div>

     </v-col>
      <v-col>
        <div v-for="w in weapons" v-bind:key="w.name">
          <v-card>
          <v-btn class="button-bg" color="teal" block @click="buyWeapon(w)">
            <h3> {{ w.name }} |</h3>
            <h4> | {{ w.cost }} g</h4>
          </v-btn>
          </v-card>
        </div>
      </v-col>
      <v-col>
        <div v-for="a in armor" v-bind:key="a.name">
          <v-card>
          <v-btn class="button-bg" color="green" block @click="buyArmor(a)">

           <h3> {{ a.name }} |</h3>
            <h4> | {{ a.cost }} g</h4>
          </v-btn>
            </v-card>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>




<script>
export default {
  props: {
    toonGold: Number,
    text: String,
  },
  data() {
    return {
      weapons: [
        {name: "Club", ap: 15, uses: 12, maxUses: 12, cost: 50 },
        {name: "Crossbow", ap: 20, uses: 8, maxUses: 8, cost: 125 },
        {name: "Falchion", ap: 35, uses: 3, maxUses: 3, cost: 225 },
        {name: "Halberd", ap: 45, uses: 3, maxUses: 3, cost: 300 },
        {name: "Death Star", ap: 99, uses: 1, maxUses: 2, cost: 1500 },
      ],
      armor: [
        {name: "Loincloth", ac: 5, cost: 15 },
        {name: "Chain Mail", ac: 15, cost: 100 },
        {name: "Onion Suit", ac: 25, cost: 200 },
        {name: "Impenetranium Attire", ac: 75, cost: 1000 },
      ],
      items: [
        {name: "Some Health", cost: 50 },
        {name: "Ring of Sacrifice", cost: 500 },
        {name: "Bloodlust", cost: 250 },
      ],
    };
  },
  methods: {
    buyWeapon(w) {

      if(w.cost <= this.toonGold) {
        this.$emit("boughtWeapon", w);
      

      } else {
        this.$emit('displayText', "You don't have enough gold!");
        
      }
    },
    buyArmor(a) {
      if(a.cost <= this.toonGold) {
      this.$emit("boughtArmor", a);
      }  else {
        this.$emit('displayText', "You don't have enough gold!");
        
      }
    },
    buyItem(i) {
              if(i.cost <= this.toonGold) {
                this.$emit("boughtItem", i);
       
              }  else {
        this.$emit('displayText', "You don't have enough gold!");
        
      }
    }
  },
};
</script>

<style>
ul {
  list-style: none;
}
</style>
