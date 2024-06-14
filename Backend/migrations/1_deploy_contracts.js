var Account = artifacts.require("Account");
var CrowdFund = artifacts.require('crowdFunding')

module.exports = function(deployer) {
  // Deploy the Account contract first
  deployer.deploy(Account)
    .then(() => {
      // Once the Account contract is deployed, deploy the CrowdFund contract
      return deployer.deploy(CrowdFund);
    });
};
