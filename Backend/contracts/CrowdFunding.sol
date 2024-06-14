// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
contract crowdFunding {

    event StoryCreated(uint256 storyNo, address accountOwnerAddr, string storyName, string genre, uint256 target, uint256 deadline, uint256 totalChapters);
    event CrowdFundCreated(uint256 crowdFundNo, uint256 storyNo, uint256 chapterNo, uint256 target, uint256 deadline, option[] options);
    event OptionCreated(uint256 crowdFundNo, uint256 optionNo, string cid, address writer, uint256 amtCollected);
    
    struct chapters {
        uint256 chapterNo;
        string cid;
        address accountWritten;
    }

    struct bigStory {
        uint256 storyNo;
        address accountOwnerAddr;
        string storyName;
        string genre;
        uint256 target;
        uint256 deadline;
        uint256 totalChapters;
        uint256 timestamp;
        chapters[] chapter;
        uint256 topOption;
    }

    struct option {
        uint256 optionNo;
        string cid;
        address writer;
        address[] donators;
        uint256[] donations;
        uint256 amtCollected;
    }

    struct crowdFund {
        uint256 crowdFundNo;
        address storyOwner;
        uint256 storyNo;
        uint256 chapterNo;
        uint256 target;
        uint256 deadline;
        bool crowdFundAvail;
        option[] options;
        uint256 timestamp;
    }

    mapping(uint256 => bigStory) public bigStories;
    mapping(uint256 => crowdFund) public crowdFundings;
    mapping(uint256 => bool) public crowdFundExists;
    uint256[] public campaignNos;
    uint256 storyCount = 0;
    uint256 crowdFundCount = 0;
    address public intermediary = 0x4C6CC2B30A8b9630cC897589cCA40c83609C77a8;

    function getStoryCount() view public returns(uint256) {
        return storyCount;
    }
    function getBigStoryChapterCount(uint256 storyNo) view public returns(uint256) {
        return bigStories[storyNo].totalChapters;
    }
    function getCrowdFundAvail(uint256 storyNo, uint256 chapterNo) view public returns(bool) {
        return crowdFundings[storyNo * 100 + chapterNo].crowdFundAvail;
    }

    function createStory(string memory storyName, string memory genre, string memory cid, uint256 _target, uint256 _deadline) external {
        require(_deadline > 0,"Deadline Should be atleast 1 day from creation of crowdFunding");
        bigStory storage newStory = bigStories[storyCount];
        newStory.storyNo = storyCount;
        storyCount++;
        newStory.accountOwnerAddr = msg.sender;
        newStory.genre = genre;
        newStory.storyName = storyName;
        newStory.totalChapters = 1;
        newStory.target = _target;
        newStory.deadline = _deadline;
        newStory.timestamp = block.timestamp;
        
        newStory.topOption = 0;
        newStory.chapter.push(chapters(1, cid, msg.sender));

        emit StoryCreated(newStory.storyNo, newStory.accountOwnerAddr, newStory.storyName, newStory.genre, newStory.target, newStory.deadline, newStory.totalChapters);
    }

    function CreateCrowdFund(uint256 storyNo, uint256 chapterNo, string memory cid) external {
        bigStory storage selectedStory = bigStories[storyNo];
        uint256 crowdFundKey = storyNo * 100 + chapterNo;
        if(!crowdFundExists[crowdFundKey]) {
            crowdFund storage newCrowdFund = crowdFundings[crowdFundKey];
            newCrowdFund.crowdFundNo = crowdFundCount;
            crowdFundCount++;
            newCrowdFund.storyNo = storyNo;
            newCrowdFund.chapterNo = chapterNo;
            newCrowdFund.target = selectedStory.target;
            newCrowdFund.deadline = selectedStory.timestamp + (selectedStory.deadline * 24 * 3600);
            newCrowdFund.storyOwner = selectedStory.accountOwnerAddr;
            newCrowdFund.options.push(option(0, cid, msg.sender, new address[](0), new uint256[](0), 0));
            crowdFundExists[crowdFundKey] = true;
            campaignNos.push(crowdFundKey);
            newCrowdFund.crowdFundAvail = true;
            newCrowdFund.timestamp = block.timestamp;
            
            selectedStory.chapter.push(chapters(chapterNo, cid, msg.sender));
            selectedStory.topOption = 0;
            emit CrowdFundCreated(newCrowdFund.crowdFundNo, newCrowdFund.storyNo, newCrowdFund.chapterNo, newCrowdFund.target, newCrowdFund.deadline, newCrowdFund.options);
        }else{
            crowdFund storage newCrowdFund = crowdFundings[crowdFundKey];
            if(newCrowdFund.crowdFundAvail)
            {
                uint256 newOption = newCrowdFund.options[newCrowdFund.options.length - 1].optionNo + 1;
                newCrowdFund.options.push(option(newOption,cid,msg.sender,new address[](0), new uint256[](0), 0));
            }  
            emit OptionCreated(newCrowdFund.crowdFundNo,newCrowdFund.options[newCrowdFund.options.length - 1].optionNo,newCrowdFund.options[newCrowdFund.options.length - 1].cid,newCrowdFund.options[newCrowdFund.options.length - 1].writer,newCrowdFund.options[newCrowdFund.options.length - 1].amtCollected);  
        }
    }

    function getBigStories() external view returns (bigStory[] memory){
        bigStory[] memory newList = new bigStory[](storyCount);
        for(uint256 i = 0; i < storyCount; i++) {
            bigStory storage newStory = bigStories[i];
            newList[i] = newStory;
        }
        return newList;
    }

    function donateToCampaign(uint256 storyNo,uint256 chapterNo,uint256 optionNo) external payable{
        
        bigStory storage currentStory = bigStories[storyNo];
        require(chapterNo == currentStory.totalChapters+1, "Please crowd fund the latest chapter!");

        uint256 crowdFundKey = storyNo * 100 + chapterNo;
        crowdFund storage currentCrowdFund = crowdFundings[crowdFundKey];
        option storage currentOption = currentCrowdFund.options[optionNo];
        require(block.timestamp < (currentCrowdFund.timestamp + currentCrowdFund.deadline) && currentOption.amtCollected <= currentCrowdFund.target * (1 ether), "Crowd Funding for this chapter has been closed!");
        
        currentOption.amtCollected += msg.value;
        currentOption.donators.push(msg.sender);
        currentOption.donations.push(msg.value);

        if(currentOption.amtCollected > currentCrowdFund.options[currentStory.topOption].amtCollected)
        {
            currentStory.topOption = optionNo;
            currentStory.chapter[currentStory.totalChapters] = chapters(chapterNo, currentOption.cid, currentOption.writer);
        }

        if(!(block.timestamp < (currentCrowdFund.timestamp + currentCrowdFund.deadline) && currentOption.amtCollected < currentCrowdFund.target * (1 ether)))
        {
            currentCrowdFund.crowdFundAvail = false;
            currentStory.totalChapters++;
        }
        (bool sent,) = payable(currentOption.writer).call{value: msg.value}("Your story got a new donation");
        if(sent){}

    }

    function getCampaign() external view returns (crowdFund[] memory) {
        crowdFund[] memory newList = new crowdFund[](campaignNos.length);
        for(uint256 i = 0; i < campaignNos.length; i++) {
            crowdFund storage newCrowdFund = crowdFundings[campaignNos[i]];
            newList[i] = newCrowdFund;
        }
        return newList;
    }

    function getCampaignByKey(uint256 storyNo,uint256 chapterNo) external view returns (crowdFund memory) {
        uint256 crowdFundKey = storyNo * 100 + chapterNo;
        crowdFund storage newList = crowdFundings[crowdFundKey];
        return newList;
    }
}