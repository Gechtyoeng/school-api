import db from '../models/index.js';

/**
 * @swagger
 * tags:
 *   - name: Teachers
 *     description: Teacher management
 */

/**
 * @swagger
 * /teachers:
 *   post:
 *     summary: Create a new teacher
 *     tags: [Teachers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, department]
 *             properties:
 *               name:
 *                 type: string
 *               department:
 *                 type: string
 *     responses:
 *       201:
 *         description: Teacher created
 */
export const createTeacher = async (req, res) => {
    try {
        const teacher = await db.Teacher.create(req.body);
        res.status(201).json(teacher);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

/**
 * @swagger
 * /teachers:
 *   get:
 *     summary: Get all teachers
 *     tags: [Teachers]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10 }
 *         description: Number of items per page
 *       - in: query
 *         name: sort
 *         schema: 
 *          type: string  
 *          enum: [name, -name]  
 *         description: sort by desc use (-name) sort by asc use (name)
 *       - in: query
 *         name: populate
 *         schema:
 *          type: string
 *          enum: [course]
 *     responses:
 *       200:
 *         description: List of teachers
 */
export const getAllTeachers = async (req, res) => {
     // take certain amount at a time
    const limit = parseInt(req.query.limit) || 10;
    // which page to take
    const page = parseInt(req.query.page) || 1;

    //sort by asc or sort by desc
    const sortParam = req.query.sort;
    let sortField;
    if(sortParam){
        if(sortParam.startsWith('-')){
            sortField = [[sortParam.slice(1),'DESC']];
        }else{
            sortField = [[sortParam, 'ASC']];
        }
    }

    //populate with course
    const populate = req.query.populate;
    let include = [];

    if(populate){
            include.push({model: db.Course})
        }

    try {
        const teachers = await db.Teacher.findAll({ 
            limit: limit, 
            offset: (page - 1) * limit,
            ...(sortField && { order: sortField }),
            include: include
        });
        res.json(teachers);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

/**
 * @swagger
 * /teachers/{id}:
 *   get:
 *     summary: Get a teacher by ID
 *     tags: [Teachers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Teacher found
 *       404:
 *         description: Not found
 */
export const getTeacherById = async (req, res) => {
    try {
        const teacher = await db.Teacher.findByPk(req.params.id, { include: db.Course });
        if (!teacher) return res.status(404).json({ message: 'Not found' });
        res.json(teacher);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

/**
 * @swagger
 * /teachers/{id}:
 *   put:
 *     summary: Update a teacher
 *     tags: [Teachers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               department:
 *                 type: string
 *     responses:
 *       200:
 *         description: Updated
 */
export const updateTeacher = async (req, res) => {
    try {
        const teacher = await db.Teacher.findByPk(req.params.id);
        if (!teacher) return res.status(404).json({ message: 'Not found' });
        await teacher.update(req.body);
        res.json(teacher);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

/**
 * @swagger
 * /teachers/{id}:
 *   delete:
 *     summary: Delete a teacher
 *     tags: [Teachers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Deleted
 */
export const deleteTeacher = async (req, res) => {
    try {
        const teacher = await db.Teacher.findByPk(req.params.id);
        if (!teacher) return res.status(404).json({ message: 'Not found' });
        await teacher.destroy();
        res.json({ message: 'Deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
