const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(bodyParser.json());
const DATA_FILE = path.join(__dirname,'data.json');
function readData(){ try{ const raw = fs.readFileSync(DATA_FILE); return JSON.parse(raw);}catch(e){ return {awards:{}, votes:{}}; } }
function writeData(d){ fs.writeFileSync(DATA_FILE, JSON.stringify(d, null, 2)); }
let data = readData();
if(!data.awards || Object.keys(data.awards).length === 0){
  data.awards = {
    "ballon-dor": { "title": "Ballon d'Or", "candidates": ["Player A","Player B","Player C"] },
    "pfa": { "title": "PFA Player of the Year", "candidates": ["Player D","Player E","Player F"] },
    "laliga": { "title": "LaLiga Best Player", "candidates": ["Player G","Player H","Player I"] },
    "fifa-best": { "title": "FIFA The Best (Men)", "candidates": ["Player J","Player K","Player L"] },
    "uefa-best": { "title": "UEFA Best Player", "candidates": ["Player M","Player N","Player O"] },
    "grammys": { "title": "GRAMMY Awards", "candidates": ["Artist 1","Artist 2","Artist 3"] },
    "headies": { "title": "The Headies", "candidates": ["Artist 4","Artist 5","Artist 6"] },
    "nigerian-idol": { "title": "Nigerian Idol", "candidates": ["Contestant A","Contestant B","Contestant C"] },
    "big-brother-africa": { "title": "Big Brother Africa", "candidates": ["Housemate A","Housemate B","Housemate C"] },
    "big-brother-naija": { "title": "Big Brother Naija", "candidates": ["Housemate D","Housemate E","Housemate F"] }
  };
  data.votes = {};
  writeData(data);
}
app.get('/api/awards',(req,res)=>{ const d = readData(); res.json({awards: d.awards}); });
app.get('/api/results/:awardId',(req,res)=>{ const d = readData(); const award = req.params.awardId; const votes = (d.votes && d.votes[award]) ? d.votes[award] : {}; res.json({award, votes}); });
app.post('/api/vote',(req,res)=>{ const {awardId, candidate} = req.body; if(!awardId||!candidate) return res.status(400).json({error:'awardId and candidate required'}); const d = readData(); if(!d.votes) d.votes = {}; if(!d.votes[awardId]) d.votes[awardId] = {}; if(!d.votes[awardId][candidate]) d.votes[awardId][candidate] = 0; d.votes[awardId][candidate] += 1; writeData(d); res.json({awardId, candidate, votes: d.votes[awardId][candidate]}); });
app.post('/api/admin/addCandidate',(req,res)=>{ const {awardId, candidate} = req.body; if(!awardId||!candidate) return res.status(400).json({error:'awardId and candidate required'}); const d = readData(); if(!d.awards[awardId]) return res.status(404).json({error:'award not found'}); d.awards[awardId].candidates.push(candidate); writeData(d); res.json({success:true, award: d.awards[awardId]}); });
app.post('/api/admin/resetVotes',(req,res)=>{ const {awardId} = req.body; const d = readData(); if(awardId){ d.votes[awardId] = {}; } else { d.votes = {}; } writeData(d); res.json({success:true}); });
const clientPath = path.join(__dirname,'..','client'); if(fs.existsSync(clientPath)){ app.use('/', express.static(clientPath)); console.log('Serving client from', clientPath); }
const PORT = process.env.PORT || 3000; app.listen(PORT, ()=> console.log('VoteHub server running on port', PORT));
