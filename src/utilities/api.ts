import { Request, Response } from 'express';
import pool from "../database/db";


export const getTickets = async (req: Request, res: Response): Promise<void> => {
    try {
        const result = await pool.query('SELECT * FROM tickets');
        res.json(result.rows);
      } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
      }
};

export const getOfficeTicketAmount = async (req: Request, res: Response): Promise<void> => {
    try {
        const result = await pool.query('SELECT * FROM read_office_ticket_amounts()');
        res.json(result.rows);
      } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
      }
};

export const purchasePaging = async (req: Request, res: Response): Promise<void> => {
  try {
      const pageNum = parseInt(req.query.pageNum as string, 10) || 1;
      const result = await pool.query('SELECT * FROM paging_purchase($1)', [pageNum]);
      res.json(result.rows);
    } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
    }
};


