/*
	The legend of Zelda: Tears of the Kingdom Savegame Editor (Compendium class) v20230522

	by Marc Robledo 2023
*/

/*
Item.prototype.save=function(){
	var categoryHash=capitalizeCategoryId(this.category);
	SavegameEditor.writeString64('Array'+categoryHash+'Ids', this.index, this.id);
	SavegameEditor.writeU32('Array'+categoryHash+'Quantities', this.index, this.quantity);
	if(this.category==='food'){
		SavegameEditor.writeU32('ArrayFoodEffects', this.index, this.foodEffect);
		SavegameEditor.writeU32('ArrayFoodEffectsHearts', this.index, this.foodEffectHearts);
		SavegameEditor.writeU32('ArrayFoodEffectsMultiplier', this.index, this.foodEffectMultiplier);
		SavegameEditor.writeU32('ArrayFoodEffectsTime', this.index, this.foodEffectTime);
		SavegameEditor.writeU32('ArrayFoodEffectsUnknown1', this.index, this.foodEffectUnknown1);
	}
}*/

var Compendium={}
Compendium.count=function(){
	var flagsOffsets=SavegameEditor._getOffsetsByHashes(Compendium.HASHES_GOT_FLAGS);
	var countFlags=0;
	var countFlagsCustom=0;
	var countFlagsStock=0;
	for(var i=0; i<Compendium.HASHES_GOT_FLAGS.length; i++){
		var val=tempFile.readU32(flagsOffsets[Compendium.HASHES_GOT_FLAGS[i]]);
		if(val===Compendium.STATUS_CUSTOM){
			countFlags++;
			countFlagsCustom++;
		}else if(val===Compendium.STATUS_STOCK){
			countFlags++;
			countFlagsStock++;
		}else if(val!==Compendium.STATUS_NO_PIC){
			console.warn('invalid compendium got flag '+i+' value: '+SavegameEditor._toHexInt(val));
		}
	}

	return {custom:countFlagsCustom, stock:countFlagsStock, total:countFlags, valid:countFlags===(countFlagsCustom+countFlagsStock)};
}
Compendium.setToStock=function(all){
	var count=0;
	var flagsOffsets=SavegameEditor._getOffsetsByHashes(Compendium.HASHES_GOT_FLAGS);
	for(var i=0; i<Compendium.HASHES_GOT_FLAGS.length; i++){
		var val=tempFile.readU32(flagsOffsets[Compendium.HASHES_GOT_FLAGS[i]]);
		if(val===Compendium.STATUS_CUSTOM || (all && Compendium.STATUS_NO_PIC)){
			tempFile.writeU32(flagsOffsets[Compendium.HASHES_GOT_FLAGS[i]], Compendium.STATUS_STOCK);
			count++;
		}
	}

	MarcDialogs.alert(count+' pictures set to stock.<br/>You can now delete all *.jpg images in /picturebook/ folder');
	SavegameEditor.refreshCompendiumCounter();
	return count;
}


Compendium.STATUS_NO_PIC=0x8d96a2c5; //RawValue=Unopened
Compendium.STATUS_CUSTOM=0x9a1f74ec; //RawValue=TakePhoto
Compendium.STATUS_STOCK=0xbedf2a35; //RawValue=Buy

Compendium.HASHES_GOT_FLAGS=[
0xbbf256d3,0x9ff57115,0x20a5ace9,0x35fc77fb,0xc5b45cc3,0x67386b44,0x1f2816d2,0x493a7ea3,0x68b56527,0x6cb0007b,0x8ffb9003,0x02679e6b,0x6e07db97,0xc07f48ea,0x6da0cf5e,0xfc25d4cd,0xa4d56e2a,0x2ad49566,0xe1f15720,0x3e602b46,0xec235bfa,0x84d32b47,0x01490087,0x3c2fb3ee,0x3642c73c,0xf920e70e,0x15a33b87,0x75464337,0xcd8c3c57,0x55382e37,0x1858e8dd,0x6757a6de,0x44f1f621,0x3828b66d,0x22651add,0x75d00262,0xabf2a04b,0x6f86c8b9,0xd472a12f,0x19599dd4,0xde35c394,0xf0236290,0xc8bb96c7,0xc3a304ce,0xa1d8dcb4,0x0d58f543,0xa7df9c3b,0xfc0f6a2b,0x63c5ae50,0x2b00690e,0x253b60a7,0x2e9545fe,0x9b647c91,0x9a51e52f,0x21fc60d6,0xfc74cc86,0xbffa39cb,0xbcc8c897,0xd2ea1926,0xfbe1a117,0x3ce769f7,0xeaf99d94,0xc77de65d,0x75136d15,0x8c8ad39d,0x6f9cc89f,0x88ce0934,0xe924b49a,0x5b8c4548,0x555ae72f,0x72d8d162,0x5db54071,0xccfec897,0x8055ec45,0x963d2101,0xea75017d,0xac883102,0x8f2873a2,0x57c928a5,0x9e3167de,0x1f00344d,0xb957a2fe,0x82b59987,0xeb6de132,0x2365eeeb,0xe47c543f,0x1175e981,0x173ba2f0,0x49898008,0xb413e809,0xb112aeb9,0xf45d1d19,0xff3031d8,0xbe16c7e0,0x0c245c74,0x5808e0be,0x8d99b51e,0x56073084,0xc4321da7,0xe6cc7624,0xd6f66f72,0xfe0bb89a,0xfd23c479,0xf394c10d,0x37016c65,0x906bb450,0x5552aa25,0xa92d4e29,0x8d3f4383,0x2dfe9bf4,0x4dd087a4,0x850c4b5c,0x239b0555,0x0102f72d,0xbafb3b52,0x0d667900,0xa4fb851a,0x5a8da868,0x4b0fab2d,0xdaeb7c3e,0x6fdcee17,0xd0a74c91,0x9a33bfc9,0xf7859470,0x37096b43,0x5196eb4e,0xdc0b441f,0x573a526d,0x0cdcd04b,0x0c02c64a,0x59b5e1c6,0x55c27208,0x23d94985,0x55d6125a,0xea2991c4,0x2e029532,0xe397589e,0x31faa0e4,0x8e25a0ce,0xe1056c6d,0x51f683ed,0xa99a62b6,0xabaff9ad,0x9293a6a6,0x197415c3,0x05bdd321,0x6d904649,0x3c8a71a0,0xf45ab07f,0x83bb7e9c,0x60ac8c69,0x579481a0,0xd5dac147,0x34d6584c,0xb2c2ac62,0xd29597f5,0x01e19529,0xdaf10794,0xa5d1a436,0x8a9062d0,0x6ac879b4,0xea7b209b,0x32b6585d,0x278ed7f7,0x316fc0e7,0xc885774b,0x10ed97c2,0x244a3293,0xd9a58129,0x2b73f5d2,0xa61ae2af,0xc5657979,0x2680889b,0x67a37207,0xee20304b,0x0e90e7ba,0x3b3aecad,0x82c9e4fe,0xe531ba22,0x9e717af0,0x50922e11,0x3a87563a,0xb3bda8db,0x696a05be,0xf16260cf,0xb237fe07,0x36876763,0x63d8ed36,0x2e74e2bb,0xcde7bb16,0x16f34cd4,0xb8db0aa5,0x2a6fb429,0xe095cc2a,0x24a8c17f,0x82fde6eb,0x15d4e07d,0xa7d72e93,0xdc016f78,0x43fba1d0,0x9fbcadec,0xd31bfdeb,0xb8ce35ac,0xbd7f8fac,0x679f5e3b,0x8f6104e2,0x289b770d,0xf58ed663,0x91f94b7b,0xd23cc404,0x0b94350d,0x3b58d40e,0xab3e9ffc,0xb52b1fbb,0x423a6d9d,0x7a97e08d,0x58d389e0,0x093e348e,0xfce0c986,0xd550e487,0x780fd0f5,0xbf011907,0x4b7c6001,0x1b37c2c9,0x1f87aa41,0x99d05bb4,0xe0fc57d2,0x03e9fdf4,0x484e35ed,0xb3309765,0x87db27a0,0x4cd238f2,0x257e13b2,0x87834862,0x8787c477,0xacbd7a7d,0x0fa65a4c,0x1155491d,0x770242b1,0x4601b30e,0x37e10a3f,0x528381a0,0x6fba0162,0x2f9df402,0x4e79ebaf,0x92d53fd6,0xfe657a94,0x79906655,0x5f7b067f,0x4027851d,0x90d3efe9,0x198e9c1d,0xd18a0a62,0xccb23b90,0x04a01831,0xc9d75295,0xb0e8d8bf,0x46cc8cb3,0xdc7bce05,0x32dd2638,0xb433e385,0x1d5668a0,0x8b87d599,0x872d7f1f,0x0bd40497,0xd878474c,0x74f5c7e8,0xe6eadc89,0x36d0ede2,0x3f8496e7,0x1b3a9be5,0x28d46680,0x657c16ae,0x1c603046,0x7434267c,0x818f5bfb,0x20ad257b,0x8f7dc71a,0x51fb9b55,0x1f325b54,0x708a0b74,0x5f85be00,0x8506f030,0x5bc81607,0x7b264eb5,0xe7d31dce,0x4a87f5ef,0xd877fd9d,0x5fec19b9,0x6a47ac80,0x5f0b9728,0xfa478599,0x45e8f779,0x64506bab,0xf9e6054e,0x7ffab325,0x4e773b46,0x9dee7aa8,0xd4cecf02,0xb330315a,0x4adaf59a,0x1151f05b,0x1e38132d,0xbd9709ab,0x27f5ff56,0xfddd2a59,0xc5060686,0x9ecd61a8,0x8d89329a,0x0f0ae12c,0x0b28103c,0xefc08e37,0x978c4e34,0xe895260d,0xec284207,0x71451f4d,0x4a8c7c25,0x8b033c0d,0x700bc62f,0x9039e0c8,0xac85e805,0x5a83b363,0x4819dccd,0x1c66f16f,0x799ac1ac,0x88106c97,0x2a3b35a1,0x415fa2e9,0x5cd1ba6a,0xb4a2920a,0xf57187e7,0x2ca13ad0,0x05012601,0x5f902760,0x5ef0e7f5,0xdf03d54a,0x98a3b62f,0xfdd8dc3a,0xe16ab457,0x0112568a,0x030469d8,0xe545e2a4,0x5b756769,0x5547650c,0xda3f9276,0x185e360a,0xeb19768e,0x73a5aa4a,0x6dea7e15,0x95dcd251,0x7e734f5d,0x1b4cb647,0xd02e8f8a,0xb0371d15,0xf073249b,0xf0d6b92f,0x5b80fd10,0x84f66e79,0xb229b841,0xbc92c563,0x02842f06,0x6d476246,0xe4ac2257,0xa35edab0,0xdd8752b5,0x56289d29,0x783175a4,0x42d033bb,0x8ac112d2,0x6cab9f5b,0xad360b3b,0x1efd490b,0x3d094bbb,0x75d301bf,0x9c64daf3,0x2d9701ae,0x39db9816,0x890ad720,0xdd641497,0x6e98878a,0xd3555b68,0x31cfe8fb,0xb85d6edf,0xf140f20e,0x809bbfb9,0x5c82563a,0x25a271c3,0xb46bb968,0xc8e985bb,0x0db36bbf,0x7cf50779,0xff665863,0x4182a6d6,0x6f864868,0xb1bc25db,0x6dfa7ecb,0xdc7d4767,0x3e87f458,0x1e37a076,0xea4ee734,0x196829d9,0xc5866cff,0x95fb09f5,0x39a60d3b,0x69b44761,0x0aaf5498,0x9af2af6d,0x5133aa6c,0x6aea3c23,0x33e250f7,0xf4aab6f4,0xae2a7ded,0x1414aed0,0x6a7de12a,0xd35d2bb2,0xb38ffafb,0x792a5ec0,0x2a037682,0xee1db1bc,0xdfeb2e80,0xb78feb8b,0x85f862ea,0x695af4f6,0x126ca7f2,0x13207bcc,0x8bb9d774,0xb6b881ba,0x0118107e,0xcb4b52e2,0xd9ad3906,0x9ceb5a30,0xe21c9abf,0x35a4be45,0x51c3c55d,0xee187589,0x1e9668ed,0xbb39460d,0x61906d1c,0x526e9423,0x2d889b61,0x65d9cffb,0x9de31ad4,0x00d63d4b,0x6dc9d131,0xdacaa4e9,0xbca58bda,0xd52cff76,0xec1e60d5,0xcdee3052,0x25089680,0x05f65fb4,0x625835d7,0x75f32973,0x299c0203,0xb54aec01,0x157db793,0xdd8860ba,0xf99bcd4f,0x29a9cfbb,0xa7f74017,0x985f02c5,0xf0e20bcd,0xdfe95eb0,0xacaf6ca5,0xd63f0a6a,0x1696e9d9,0x70dc2dba,0x3389df22,0x97625c5b,0x1755d43b,0x453aeeb1,0xd530c3dc,0xa29e03ee,0xa8edcfb2,0x835d8b66,0x5ee05f4c,0xfad43bc1,0x394b1b7a,0xb528ed2b,0x0e243b82,0x34816bfb,0x73325594,0xf7bd2d2b,0x0a2f2fa1,0xecfa5766,0x8c52dacd,0xb9627088,0xe5cc93b7,0x2668e51f,0x8a8c8570,0xb23944dd,0xf43a072a,0xfbbd3492,0x5b09bacb,0x27a3778d,0x617ebcb4,0x3390f921,0x67bb6a7c,0xe7204752,0xa5383c88,0x3c4b7b8d,0x827ea767,0xa8a2e7b8,0x6dd46b75,0xdf76d934,0x5c906c16,0x9820338e,0x50446d5d,0xd471103a
];