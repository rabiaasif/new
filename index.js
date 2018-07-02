'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')

const app = express()

app.set('port', (process.env.PORT || 5000))

// Allows us to process the data
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

// ROUTES

app.get('/', function(req, res) {
	res.send("Hi I am a chatbot")
})

let token = "EAAPlfrtDBiQBADj5jEGFhnKdrFxZCtftqtEAUU4aX8Hwh9MJo5PWfhRAvwcaps4opjvZBGa1Ya73460P1nZCF4yejdinvNo5OdxSeMviZBdUETQtiECrt28aXflkYtfkZCk1Yra4BBfpEtEoZBqYZAsAsy7lq5fd6zU5CKvL7El0QZDZD"

// Facebook 

app.get('/webhook/', function(req, res) {
	if (req.query['hub.verify_token'] === "rabia") {
		res.send(req.query['hub.challenge'])
	}
	res.send("Wrong token")
})

app.post('/webhook/', function(req, res) {
	let messaging_events = req.body.entry[0].messaging
	for (let i = 0; i < messaging_events.length; i++) {
		let event = messaging_events[i]
		let sender = event.sender.id
		if (event.message && event.message.text) {
			let text = event.message.text
			if (text.includes("directions")) {
					text = text.substring(13, 100)
			sendText(sender, "https://www.google.com/maps/dir/" + (text.replace(/\s/g, '')) )
		};
		if (text.includes("weather")) {
					
			sendText(sender, "https://www.google.ca/search?ei=BxE6W9uCGqzSjwT8kbKwBQ&q=weather&oq=weather&gs_l=psy-ab.3..0i131i67k1l4j0i131k1j0i131i67k1j0i131k1j0i67k1l3.3530.4401.0.4714.7.7.0.0.0.0.136.551.4j2.6.0....0...1.1.64.psy-ab..1.6.549....0.TQORcETqcmY")
		};
		

			sendText(sender, "Text Echo:" + text.substring(0,100))
		
		}
	}
	res.sendStatus(200)
})


function sendText(sender, text) {
	let messageData = {text: text}
	request({
		url: "https://graph.facebook.com/v2.6/me/messages",
		qs : {access_token: token},
		method: "POST",
		json: {
			recipient: {id: sender},
			message : messageData,
		}
	}, function(error, response, body) {
		if (error) {
			console.log("sending error")
		} else if (response.body.error) {
			console.log("response body error")
		}
	})
}

app.listen(app.get('port'), function() {
	console.log("running: port")
})


