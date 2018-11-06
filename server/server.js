'use strict'
const express = require('express')
const app = express();


const { ForgeAPI } = require('./forgeapi')
const auth = new ForgeAPI( process.env.FORGE_CLIENT_ID, process.env.FORGE_CLIENT_SECRET, process.env.FORGE_BUCKET);
const atob = (data) => Buffer.from(data).toString('base64');


//////////////////
// List bucket files, access-token, thumbnail as js file
// made cached for quicker websites (and easy for local testing to avoid CORS issues)
// or... use the other more tradional two endpoints.
//////////////////
app.get('/api/_adsk.js', async (req, res) => {
	const token = await auth.getAccessToken();
	const files = (await auth.getBucketFiles()).items.map( i => {
		const safeurn = atob(i.objectId).split("=")[0];
		const thumb = `/api/thumbnail?urn=${safeurn}`;
		return {objectId:i.objectId, objectKey:i.objectKey, size:i.size, urn:`urn:${safeurn}`, thumb:thumb };
	});
	res.setHeader("Cache-Control", `public, max-age=${token.expires_in}`); // js file is cached for about 15 mins
	res.send( `var _adsk = ${JSON.stringify( {token:token, files: files })}` );
});



//////////////////
// provide access-token
//////////////////
app.get('/api/token', async (req, res) => {
	res.json( await auth.getAccessToken() );
});


//////////////////
// List files from bucket
//////////////////
app.get('/api/files', async (req, res) => {
	//res.json( (await auth.getBucketFiles()).items );
	res.json( (await auth.getBucketFiles()).items.map( i => {
		const urn = atob(i.objectId).split("=")[0];
		const thumb = `/api/thumbnail?urn=${urn}`;
		return {objectId:i.objectId, objectKey:i.objectKey, size:i.size, urn:'urn:'+urn, thumb:thumb };
	}));
});


//////////////////
// server bucket thumbnails
//////////////////
app.get('/api/thumbnail', async (req, res) => {
	res.setHeader('Content-type', 'image/png');
	res.setHeader("Cache-Control", "public, max-age=3600");
    res.end(await auth.getThumbnail(req.query.urn));
});


//////////////////
app.get('/api/upload', async (req, res) => {
	res.json( await auth.getAccessToken() );
});


//////////////////
app.get('/api/createscene', async (req, res) => {
	res.json( await auth.getAccessToken() );
});


//////////////////
app.get('/api/processjob', async (req, res) => {
	res.json( await auth.getAccessToken() );
});


//////////////////
//const port = process.env.PORT || 3000;
// <-- uncomment below line for local debugging, then type: >node server.js
// app.listen(port, () => { console.log(`Server listening on port ${port}`); });
module.exports = app
