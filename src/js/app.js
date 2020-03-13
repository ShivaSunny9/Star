App = {
  web3Provider: null,
  contracts: {},

  init: function() {
    return App.initWeb3();
  },

  initWeb3: function() {
    // Initialize web3 and set the provider to the testRPC.
    if (typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      // set the provider you want from Web3.providers
      App.web3Provider = new Web3.providers.HttpProvider('http://127.0.0.1:7545');
      web3 = new Web3(App.web3Provider);
    }

    return App.initContract();
  },

  initContract: function() {
    $.getJSON('StarNotary.json', function(data) {
      // Get the necessary contract artifact file and instantiate it with truffle-contract.
      var StarNotaryArtifact = data;
      App.contracts.StarNotary = TruffleContract(StarNotaryArtifact);

      // Set the provider for our contract.
      App.contracts.StarNotary.setProvider(App.web3Provider);

      // Use our contract to retieve and mark the adopted pets.
      return App.setStatus();
    });
  },

  setStatus: function(message) {
    const status = document.getElementById("status");
    status.innerHTML = message;
  },

  createStar: async function() {
    const { createStar } = this.meta.methods;
    const name = document.getElementById("starName").value;
    const id = document.getElementById("starId").value;
    await createStar(name, id).send({from: this.account});
    App.setStatus("New Star Owner is " + this.account + ".");
  },
  creator: async function() {
    const { creator } = this.meta.methods;
    const you = document.getElementById("s").value;
    await creator(you).send({from: App.creator});
    App.creator("creator name is " + App.creator + ".");
  },
  lookUp: async function (){
   const { lookUptokenIdToStarInfo } = this.meta.methods;
   const id = parseInt(document.getElementById("tokenID").value);
   const name = await lookUptokenIdToStarInfo(id).call({from: this.account});
   console.log(name);
   document.getElementById('getStartName').innerHTML = '<b>Star name is ' + name + '</b>';

 }
};
(function() {
  (window).load(function() {
    App.init();
  });
});
