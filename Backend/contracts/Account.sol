// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/utils/Strings.sol";
contract Account {
    struct Contribute{
        uint256 postId;
        uint256 amount;
    }

    struct User {
        string name;
        address accountOwnerAddr;
        string profilePicture;
        string Password;
        string bio;
        uint256 postCount;
        uint256 shortStoryCount;
        uint256 contributionCount;
        uint256 quoteCount;
        uint256[] posts;
        Contribute[] amountContributed;
    }

    struct Posts {
        uint256 postId;
        string cid;
        string Type;
        string Topic;
        string Genre;
        address Author;
        uint256 like;
        uint256 contribution;
        uint256 timestamp;
    }

   
    mapping(address => User) public users;
    mapping(uint256 => Posts) public allPosts;
    address[] public allAcc;
    uint256 public postCounter;

    event AccountCreated(address indexed accountOwnerAddr);
    event UserDetailsUpdated(address indexed accountOwnerAddr);
    event PostCountUpdated(address indexed accountOwnerAddr, uint256 contributionCount);
    event PostDeleted(address indexed accountOwnerAddr, uint256 postId);

    function createAccount(string memory _name, string memory _profilePicture, string memory _bio, string memory _password) external {
        require(users[msg.sender].accountOwnerAddr == address(0), "Account already exists");

        User storage newUser = users[msg.sender];
        newUser.name = _name;
        newUser.accountOwnerAddr = msg.sender;
        newUser.profilePicture = _profilePicture;
        newUser.bio = _bio;
        newUser.Password = _password;
        newUser.postCount = 0;
        newUser.shortStoryCount = 0;
        newUser.contributionCount = 0;
        newUser.quoteCount = 0;
        allAcc.push(msg.sender);
        emit AccountCreated(msg.sender);
    }

    struct AccountDetails {
    string name;
    address accountOwnerAddr;
    string profilePicture;
    string bio;
    string Password;
    uint256 postCount;
    uint256 shortStoryCount;
    uint256 contributionCount;
    uint256 quoteCount;
    uint256[] postDetails;
    
    
}

  function getAllAccounts() external view returns (AccountDetails[] memory) {
    uint256 totalAccounts = allAcc.length;
    AccountDetails[] memory allDetails = new AccountDetails[](totalAccounts);

    for (uint256 i = 0; i < totalAccounts; i++) {
        allDetails[i] = printAccountDetails(allAcc[i]);
    }

    return allDetails;
}

    function updateUserDetails(string memory _name, string memory _profilePicture, string memory _bio,string memory _password) external {
        require(users[msg.sender].accountOwnerAddr != address(0), "Account does not exist");

        User storage currentUser = users[msg.sender];
        currentUser.name = _name;
        currentUser.profilePicture = _profilePicture;
        currentUser.bio = _bio;
        currentUser.Password = _password;

        emit UserDetailsUpdated(msg.sender);
    }

   function addPosts(string memory _cid, string memory _type, string memory _topic, string memory _genre) external {
        uint256 newPostId = postCounter; 
        postCounter++; 

        Posts storage newPost = allPosts[newPostId];
        newPost.postId = newPostId;
        newPost.cid = _cid;
        newPost.Type = _type;
        newPost.Topic = _topic;
        newPost.Genre = _genre;
        newPost.like = 0;
        newPost.Author = msg.sender;
        newPost.timestamp = block.timestamp; 
        User storage currentUser = users[msg.sender];
        currentUser.postCount++;
        if (compareStrings(_type, "short story")) {
            currentUser.posts.push(newPostId);
            currentUser.shortStoryCount++;
        } else {
            currentUser.posts.push(newPostId);
            currentUser.quoteCount++;
        }

}

    
    function printAccountDetails(address userAddress) public view returns (AccountDetails memory) {
    require(users[userAddress].accountOwnerAddr != address(0), "Account does not exist");

    User storage user = users[userAddress];

    uint256[] memory postDetailsTemp = new uint256[](user.postCount);
    for (uint256 i = 0; i < user.postCount; i++) {
        postDetailsTemp[i] = user.posts[i];
    }


     return AccountDetails({
        name: user.name,
        accountOwnerAddr: user.accountOwnerAddr,
        profilePicture: user.profilePicture,
        bio: user.bio,
        Password: user.Password,
        postCount: user.postCount,
        shortStoryCount: user.shortStoryCount,
        contributionCount: user.contributionCount,
        quoteCount: user.quoteCount,
        postDetails:postDetailsTemp
    });
}

function getUserMetaData(address userAddress) public view returns (string[] memory) {
    User storage user = users[userAddress];
    string[] memory metaData = new string[](3);
    metaData[0] = user.name;
    metaData[1] = user.profilePicture;
    metaData[2] = Strings.toHexString(uint256(uint160(user.accountOwnerAddr)), 20);
    return metaData;
}


function compareStrings(string memory a, string memory b) internal pure returns (bool) 
{
    return keccak256(abi.encodePacked(a)) == keccak256(abi.encodePacked(b));
}


function incrementContributionCount(address userAdd) external {
    require(users[userAdd].accountOwnerAddr != address(0), "Account does not exist");

    User storage currentUser = users[userAdd];
    currentUser.contributionCount++;
    emit PostCountUpdated(userAdd, currentUser.contributionCount);
}

function getPostsByType(string memory _postType) external view returns (Posts[] memory) {
        uint256 totalPosts = postCounter;
        uint256 matchingPostsCount = 0;
        
        for (uint256 i = 0; i < totalPosts; i++) {
            if (keccak256(abi.encodePacked(allPosts[i].Type)) == keccak256(abi.encodePacked(_postType))) {
                matchingPostsCount++;
            }
        }
        if(compareStrings(_postType, "All"))
        {
            matchingPostsCount = totalPosts;
        }
        Posts[] memory matchingPosts = new Posts[](matchingPostsCount);
        uint256 matchingIndex = 0;
        if(compareStrings(_postType, "All"))
        {
            for (uint256 i = 0; i < totalPosts; i++) {
                matchingPosts[matchingIndex] = allPosts[i];
                matchingIndex++;
            }
        }
        else 
        {
            for (uint256 i = 0; i < totalPosts; i++) {
            if (keccak256(abi.encodePacked(allPosts[i].Type)) == keccak256(abi.encodePacked(_postType))) {
                matchingPosts[matchingIndex] = allPosts[i];
                matchingIndex++;
            }
            }
        }
        

        return matchingPosts;
}

function getPostsByAcc(address userAddress,string  memory _type) external view returns(Posts[] memory){
    User storage currentUser = users[userAddress];
    Posts[] memory typePosts;
    if(compareStrings(_type, "short story"))
    {
        uint256 typePostCount = 0;
        typePosts = new Posts[](currentUser.shortStoryCount);
        for(uint256 i=0;i < currentUser.postCount;i++)
        {
             if(compareStrings(allPosts[currentUser.posts[i]].Type,_type))
             {
                typePosts[typePostCount] = allPosts[currentUser.posts[i]];
                typePostCount++;
             }
        }
    }
    else 
    {
        uint256 typePostCount = 0;
        typePosts = new Posts[](currentUser.quoteCount);
        for(uint256 i=0;i < currentUser.postCount;i++)
        {
             if(compareStrings(allPosts[currentUser.posts[i]].Type,_type))
             {
                typePosts[typePostCount] = allPosts[currentUser.posts[i]];
                typePostCount++;
             }
        }
    }
    return typePosts;
}

function deletePost(uint256 postId) external {
        require(postId < postCounter, "Invalid post ID");

        Posts storage postToDelete = allPosts[postId];
        // require(postToDelete.Author == msg.sender, "You are not the author of this post");

        // Delete post from user's posts
        User storage currentUser = users[msg.sender];
        deleteFromArray(currentUser.posts, postId);
        currentUser.postCount--;
        if(compareStrings(postToDelete.Type,"short story"))
        {
            currentUser.shortStoryCount--;
        }else {
            currentUser.quoteCount--;
        }
        // Delete post from allPosts
        // deleteFromMapping(allPosts, postId);
        postToDelete.cid = "";
        postToDelete.postId = 0;
        postToDelete.Topic = "";
        postToDelete.Type ="";
        postToDelete.Genre="";
        postToDelete.like=0;
        postToDelete.Author=address(0);
        emit PostDeleted(msg.sender, postId);
    }

    // Function to delete an element from an array
    function deleteFromArray(uint256[] storage array, uint256 index) internal {
        // require(index < array.length, "Index out of bounds");
        if (index < array.length - 1) {
            array[index] = array[array.length - 1];
        }
        array.pop();
    }
    
    function addLike(uint256 _postId) external
    {
        Posts storage post = allPosts[_postId];
        post.like++;
        
    } 

     receive() external payable {
        // Optional: You can include logic to handle the received Ether
    }

  function addContribute(uint256 _postId) public payable {
    User storage accountSending = users[msg.sender];
    Posts storage post = allPosts[_postId];
    (bool sent,) = payable(post.Author).call{value: msg.value}("");
    if(sent)
    {
        Contribute memory ethSend = Contribute({
        postId: _postId,
        amount: msg.value
        });
        accountSending.amountContributed.push(ethSend);
        post.contribution += msg.value;
    }

}
    
    

}
