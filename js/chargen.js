var character;
let renderer = Renderer.get();

var races;
$.get("/data/races.json", function(data) {
	races = data;
});

function init(file, callback) {
	var rawFile = new XMLHttpRequest();
	rawFile.overrideMimeType("application/json");
	rawFile.open("GET", file, true);
	rawFile.onreadystatechange = function() {
		if (rawFile.readyState === 4 && rawFile.status == "200") {
			callback(rawFile.responseText);
		}
	}
	rawFile.send(null);
}

init("data/characters/character-template.json", function(text) {
	character = JSON.parse(text);
	resetAbilityScores();
	renderCharacter();
	preview("races")
});

function renderCharacter() {
	renderer.setFirstSection(true);
	renderer.resetHeaderIndex();

	const renderStack = [];
	renderer.recursiveRender(character, renderStack);
	var renderText = renderStack.join("");

	$("#content").html(`
		<tr><th class="border" colspan="6"></th></tr>
		<tr class="text"><td colspan="6">` + renderText + `</td></tr>
		<tr><th class="border" colspan="6"></th></tr>
	`);
}

function resetAbilityScores() {
	var abilities = ["str","dex","con","int","wis","cha"];
	for (var i = 0; i < abilities.length; i++) {
		$("#" + abilities[i] + "Input").val(8);
	}
	$("#nameInput").val("");
}

function updateAbilityScore(ability) {
	character.data[ability] = parseInt($("#" + ability + "Input").val());
	renderCharacter();
}

function updateName() {
	character.data.name = $("#nameInput").val();
	renderCharacter();
}

function preview(page) {
	console.log("Getting " + page + "...");
	$("#contentPreview").html("<iframe id='contentPreviewWindow' src='/" + page + ".html' style='width:100%; nav{display:none}' height='500'></iframe><button onclick=\"addSelection('" + page + "')\">Choose</button>");

	$("#contentPreviewWindow").ready(function() {
		$("#contentPreviewWindow").contents().find("nav").remove();
	})

}

function addSelection(page) {

	switch(page) {
		case "races": addRace(); break;
		case "classes": addClass(); break;
		case "backgrounds": addBackground(); break;
		case "feats": addFeat(); break;
		case "spells": addSpell(); break;
		default: return;
	}


}

function addRace() {

	lookupRace();

}

function lookupRace() {
	var location = $("#contentPreviewWindow").get(0).contentWindow.location;
	console.log(location);
	var hash = decodeURI(location.hash).toUpperCase().replace("#", "").replace(" (BASE)", "").replace("%3B", ";").split("_");
	var source = hash[1];
	var search;
	var race;
	var subrace;

	if (hash[0].includes("(")) {
		race = hash[0].substring(0, hash[0].indexOf(" "));
		subrace = hash[0].substring(hash[0].indexOf("(") + 1, hash[0].indexOf(")"));
		console.log(race);
		console.log(subrace);
		console.log(source);
		console.log(races["subrace"].find(r => r.name?.toUpperCase() === subrace && r.raceName.toUpperCase() === race && r.source.toUpperCase() === source));
	} else {
		race = hash[0];
		subrace = null;
		console.log(race);
		console.log(subrace);
		console.log(source);
		console.log(races["race"].find(r => r.name?.toUpperCase() === race && r.source.toUpperCase() === source));
	}
}

function addClass() {

}

function addBackground() {

}

function addFeat() {

}

function addSpell() {

}

