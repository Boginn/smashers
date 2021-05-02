<template>
  <v-container>
    <v-row>
      <v-col> </v-col>
    </v-row>

    <v-row>
      <v-col v-for="m in encounter" v-bind:key="m.id">
        <monster :monster="m" :bgActive="bgActive"></monster>
      </v-col>

        <v-spacer v-if="encounter.length == 1"></v-spacer>
        <v-spacer v-if="finalBattle"></v-spacer>

    </v-row>

    <v-row>
      <v-col>
        <game-stage
          :bgMessage="bgMessage"
          :text="displayText"
          :combatLog="combatLog"
          :outOfCombat="outOfCombat"
          :bossCondition="bossCondition"
          @continue="nextStage"
        ></game-stage>
      </v-col>
      <v-col>
        <game-char
          :toon="toon"
          :bgActive="bgActive"
          :equip="equip"
          :inventory="inventory"

          @action="gameRound"
          @lockMove="lockMove = true"
          
        ></game-char>
      </v-col>
    </v-row>

    <v-row> </v-row>
  </v-container>
</template>

<script>
import GameStage from "../components/GameStage";
import GameChar from "../components/GameChar";
import Monster from "../components/Monster";

export default {
  components: {
    GameStage,
    GameChar,
    Monster,
  },
  data() {
    return {
      bgMessage: "",
      bgActive: "",
      displayText: "",
      combatLog: [],
      lockMove: false,
      timeout: 3000,
      stage: 0,
      target: null,
      encounter: [],
      xpSlope: 20,
      outOfCombat: false,
      inventory: [{ name: "Unarmed", ap: 5 }],
      equip: null,
      monsterTag: 200,
      bossCondition: false,
      finalBattle: false,


      toon: {
        name: "Rambo",
        level: 1,
        xp: 0,
        points: 0,
        gold: 100,
        hp: null,
        ac: null,
        ap: null,
        selectedWeapon: null,
        defending: false,

        strength: 10,
        dexterity: 8,
        willpower: 8,
        vigor: 5,
      },

      monsters: [
        {
          name: "Goblin",
          xp: 10,
          gold: 150,
          active: false,
          targeted: false,
          hp: null,
          ac: null,
          ap: null,
          defending: false,
          damage: null,
          strength: 20,
          dexterity: 1,
          willpower: 0,
          vigor: 11,
        },
        {
          name: "Bugbear",
          xp: 30,
          gold: 200,
          active: false,
          targeted: false,
          hp: null,
          ac: null,
          ap: null,
          defending: false,
          damage: null,
          strength: 25,
          dexterity: 8,
          willpower: 0,
          vigor: 12,
        },
        {
          name: "Ogre",
          xp: 40,
          gold: 250,
          active: false,
          targeted: false,
          hp: null,
          ac: null,
          ap: null,
          defending: false,
          damage: null,
          strength: 30,
          dexterity: 12,
          willpower: 1,
          vigor: 13,
        },
        {
          name: "Darkeater Midir",
          xp: 9999,
          gold: 9999,
          active: false,
          targeted: false,
          hp: null,
          ac: null,
          ap: null,
          defending: false,
          damage: null,
          strength: 60,
          dexterity: 40,
          willpower: 10,
          vigor: 100,
        },

      ],

      
    };
  },

  methods: {
    pharc(monster, timeout) {
      return new Promise((resolve) => {
        setTimeout(() => {
          let damage = this.rollDamage(monster.ap);
          this.resolveAction(damage, monster, this.toon);

          this.timeout += 3000;
          resolve(damage);
        }, timeout);
      });
    },
    gameRound(damage) {
      // init
      if (!this.target) {
        this.target = this.encounter[0];
      }
      this.lockMove = true;
      this.timeout = 3000;

      this.lock();

      // Player goes first
      this.resolveAction(damage, this.toon, this.target);
      this.endTurn();

      // then monsters
      this.encounter.forEach((monster) => {
        this.monsterTurn(monster);
        this.timeout += 3000;
        this.endTurn();
      });
    },
    monsterTurn(monster) {
      setTimeout(() => {
        monster.active = true;
        monster.defending = false;

        let monsterIndex = this.encounter.indexOf(monster);
        if (monsterIndex > 0) {
          this.encounter[monsterIndex - 1].active = false;
        }

        let roll = Math.floor(Math.random() * 20);

        console.log(roll);
        let damage = -1;

        if (roll < 6) {
          monster.defending = true;
        } else if (roll == 20) {
          damage = monster.ap;
        } else {
          // roll damage
          damage = this.rollDamage(monster.ap);
        }

        // needs a check because of setTimeouts
        if (monster.hp != 0) {
          this.resolveAction(damage, monster, this.toon);
        }

        console.log(this.timeout + "timeout");
      }, this.timeout);
    },
    resolveAction(damage, wielder, victim) {
      // check if attack or defend
      if (wielder.defending) {
        this.combatLog.push(`${wielder.name} defends!`);
        this.bgMessage = "defend-bg";
      } else {
        console.log(victim.ac + "ac");
        damage -= victim.ac;
        console.log(damage + " damage");

        // If damage is less than 0, make it 0
        // Apply defense if true
        damage < 0
          ? (damage = 0)
          : victim.defending
          ? (damage -= Math.floor((damage / 100) * 25))
          : damage;
        console.log(
          damage + ` after defending (defending = ${victim.defending})`
        );

        // Update descriptions
        this.bgMessage = "attack-bg";
        !damage
          ? this.combatLog.push(
              `${wielder.name} misses ${victim.name} and deals no damage!`
            )
          : this.combatLog.push(
              `${wielder.name} attacks ${victim.name} for ${damage}`
            );

        victim.hp - damage <= 0 ? (victim.hp = 0) : (victim.hp -= damage);
      }
      this.displayText = this.combatLog.slice().reverse()[0];
      if (victim.hp == 0) {
        this.hollow(victim);
      }
    },
    endTurn() {
      setTimeout(() => {
        this.bgMessage = "";

        this.displayText = "";
      }, this.timeout - 100);
    },
    lock() {
      setTimeout(() => {
        this.lockMove = false;
        this.encounter.forEach((monster) => {
          monster.active = false;
        });
      }, this.encounter.length * 4000);
    },
    checkWin() {
      if (!this.encounter.length) {
        this.displayText = "Victory!";
        this.outOfCombat = true;
        this.lockMove = true;
      }
    },
    hollow(victim) {
      if (victim.level) {
        // player dies
        victim;
      } else {
        setTimeout(() => {
          this.combatLog.push(`${victim.name} is dead!`);
          this.encounter.splice(this.encounter.indexOf(victim), 1);

          // autotarget
          this.target = this.encounter[0];

          // reward
          this.toon.xp += this.randomDamage(this.toon.willpower);
          this.toon.xp += victim.xp;
          let rollgold = this.rollDamage(victim.gold);
          this.toon.gold += rollgold;
          this.combatLog.push(`${this.toon.name} gained ${victim.xp} xp`);
          this.combatLog.push(`${this.toon.name} gained ${victim.gold} g`);

          this.kindling();
          this.checkWin();
        }, 1500);
      }
    },
    kindling() {
      if (this.toon.xp >= this.xpSlope) {
        this.toon.level += 1;
        // [1/2] bossconditions
              if(this.toon.level>=2) {
        this.bossCondition = true;
      }
        this.toon.points += 4;
        this.xpSlope *= 1.5;
        this.combatLog.push(`${this.toon.name} gained a level!`);
        // heal player
        this.toon.hp+=this.toon.willpower+5;
        
      }
    },
    bossStage() {
      this.outOfCombat = false;
      this.finalBattle = true;
      this.displayText = 'The final battle!';
            // heal player
        this.toon.hp = this.toon.vigor*10;
        this.seedEncounter(1, 4);
 
    },
    nextStage() {
      // init
      this.stage += 1;
      this.combatLog = [];
      // [1/2] bossconditions
      if(this.stage>=10) {
        this.bossCondition = true;
      }
      this.$emit('nextStage', this.stage);
      this.outOfCombat = false;
      this.displayText = '';

      // heal player
      if(this.toon.hp+this.toon.vigor*1 > this.toon.vigor*10) {
        this.toon.hp = this.toon.vigor*10;
      } else {
        this.toon.hp+=this.toon.vigor*1;
      }

      this.lockMove = false;
      

      // seedEncounter(howMany, index of monster)
      // 0 goblin | 1 bugbear | 3 ogre 

      if (this.stage == 1) {
        this.seedEncounter(2, 0);
      } else if (this.stage < 4) {
        this.seedEncounter(3, 0);
      } else if (this.stage < 6) {
        if( this.rollDamage(20) < 15) {
        this.seedEncounter(1, 0);
        this.seedEncounter(1, 1);
        } else {
        this.seedEncounter(2, 0);
        this.seedEncounter(1, 1);
        } 
      } else if (this.stage < 8) {
        if( this.rollDamage(20) < 15) {
        this.seedEncounter(2, 0);
        this.seedEncounter(1, 1);
        } else {
        this.seedEncounter(1, 0);
        this.seedEncounter(2, 1);
        } 
      } else  {
        if( this.rollDamage(20) < 15) {
        this.seedEncounter(1, 1);
        this.seedEncounter(1, 2);
        } else {
        this.seedEncounter(1, 2);
        } 
      }
    },
    seedEncounter(howMany, index) {
      
      for (let i = 0; i < howMany; i++) {


        // create new monster
          let monster = Object.assign({}, this.monsters[index]);

        // scale attributes
          monster.strength+=this.stage/2;
          monster.dexterity+=this.stage/2;
          monster.willpower+=this.stage/2;
          monster.vigor+=this.stage/2;

        // assign unique id
        this.monsterTag+=1;
        var tagOn = {
          id: this.monsterTag
        };
        monster = Object.assign(monster, tagOn);
        // push
        this.encounter.push(monster);
      }
    },
    rollDamage(n) {
      let r = Math.floor(Math.random() * Math.floor(n));
      r < n / 2 ? (r = Math.floor(n / 2)) : r;
      // lowest roll is half of ap
      return r;
    },
    percent(percent, hp) {
      return (hp / 100) * percent;
    },
  },
  created() {
    this.nextStage();
  },
};
</script>

<style>

.highlight {
  background-color: rgba(0, 255, 255, 0.288);
  background: rgba(0, 255, 255, 0.288);
}

</style>
