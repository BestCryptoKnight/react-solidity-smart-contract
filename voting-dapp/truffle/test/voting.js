const Voting = artifacts.require('./Voting.sol');

const toAscii = function(hex) {
    let str = '',
        i = 0,
        l = hex.length;
    if (hex.substring(0, 2) === '0x') {
        i = 2;
    }
    for (; i < l; i+=2) {
        const code = parseInt(hex.substr(i, 2), 16);
        if (code === 0) continue; // this is added
        str += String.fromCharCode(code);
    }
    return str;
};

contract('Voting', (accounts) => {
  it('...should start with an empty candidates list', () => {
    let votingInstance;
    return Voting.deployed()
      .then(instance => {
        votingInstance = instance;

        return votingInstance.listCandidates.call({from: accounts[0]});
      })
      .then(candidateList => assert.equal(candidateList.length, 0, 'The candidate list is not empty.'))
  });

  it('...should postulate a new candidate', () => {
    let votingInstance;
    const candidate = 'John Doe';
    return Voting.deployed()
      .then(instance => {
        votingInstance = instance;
        return votingInstance.postulateCandidate(candidate, {from: accounts[0]})
      })
      .then(() => votingInstance.listCandidates.call({from: accounts[0]}))
      .then(candidateList => candidateList.map(toAscii))
      .then(candidateList => {
        assert.include(candidateList, candidate, 'Candidate is not on the list');
      });
  });

  it('...should vote for candidate', () => {
    let votingInstance;
    const candidate = 'John Doe';

    return Voting.deployed()
      .then(instance => {
        votingInstance = instance;
        return votingInstance.voteForCandidate(candidate, {from: accounts[0]});
      })
      .then(() => votingInstance.getCandidateVotes.call(candidate, {from: accounts[0]}))
      .then(response => response.c[0])
      .then((votes) => {
        assert.equal(votes, 1, 'Candidate does not have votes');
      })
  });

  it('...should get votes for the candidate', () => {
    let votingInstance;
    const candidate = 'John Doe';

    return Voting.deployed()
      .then(instance => {
        votingInstance = instance;
        return votingInstance.votes.call(candidate, {from: accounts[0]});
      })
      .then(() => votingInstance.getCandidateVotes.call(candidate, {from: accounts[0]}))
      .then(response => response.c[0])
      .then((votes) => {
        assert.equal(votes, 1, 'Candidate does not have votes');
      })
  })
});