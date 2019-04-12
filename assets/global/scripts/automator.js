class Automator{

  constructor(){

  }

  attachNewResource(){

  }

  automateMovement(){
    console.log('automator started');

    for (var resource in initObj){
      initObj[resource].initAutomation();
    }
  }
}

var automator = new Automator();

