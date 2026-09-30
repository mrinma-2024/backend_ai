const express = require("express");
const path = require("path");
const pdfParse = require("pdf-parse");
const { GoogleGenAI } = require("@google/genai");
const resumeModel = require("../Models/resume");

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

exports.addResume = async (req, res) => {
  try {
    const { user, job_desc } = req.body;
    const pdfBuffer = req.file.buffer || null;
    const pdfPath = req.file.path;
    const fs = require("fs");
    const dataBuffer = fs.readFileSync(pdfPath);
    const pdfData = await pdfParse(dataBuffer);
    const resumeText = pdfData.text;
    const prompt = `
You are an expert ATS (Applicant Tracking System) and technical hiring manager.
Compare the following Resume text against the Job Description.

Job Description:
"""${job_desc}"""

Resume Text:
"""${resumeText}"""

Respond ONLY in valid raw JSON with this exact schema:
{
  "score": "A percentage match score out of 100",
  "strengths": ["list of matching key skills"],
  "missing_skills": ["list of critical missing skills"],
  "feedback": "A concise summary of how well the candidate fits and recommendations for improvement"
}
`;
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash-lite",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });
    const analysis = JSON.parse(response.text);
    fs.unlinkSync(req.file.path);
    const newResume = new resumeModel({
      user,
      job_desc: job_desc,
      resume_name: req.file.originalname,
      score: String(analysis.score),
      strengths: analysis.strengths,
      feedback: analysis.feedback,
      missing_skills: analysis.missing_skills,
    });
    await newResume.save();
    return res.status(200).json({
      success: true,
      data: newResume,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, message: "Failed to analyse resume" });
  }
};
