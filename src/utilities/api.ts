import { Request, Response } from 'express';
import pool from "../database/db";

//ticket테이블 조회
export const getTickets = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await pool.query('SELECT * FROM tickets');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

//사무실 식권개수 조회 api
export const getOfficeTicketAmount = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await pool.query('SELECT * FROM read_office_ticket_amounts()');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

//구매기록 페이징 api
export const purchasePaging = async (req: Request, res: Response): Promise<void> => {
  try {
    const pageNum = parseInt(req.query.pageNum as string, 10) || 1;

    const validPage = Math.max(pageNum, 1);

    const result = await pool.query('SELECT * FROM paging_purchase($1)', [validPage]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};
//구매기록 등록 api
export const insertPurchaseHistory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { input_date, input_ticket_name, input_quantity, input_price } = req.body as {
      input_date: string;
      input_ticket_name: string;
      input_quantity: number;
      input_price: number;
    };
    const result = await pool.query('SELECT * FROM insert_purchase($1,$2,$3,$4)', [input_date, input_ticket_name, input_quantity, input_price]);
    res.status(201).json({ message: '구매 내역이 등록되었습니다.', data: result.rows[0] });
  } catch (error) {
    console.error('Error creating ticket purchase:', error);
    res.status(500).json({ error: '구매 내역을 등록하는데 실패했습니다.' });
  }
};
//식권구매기록 취소 api
export const cancelPurchaseHistory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { purchase_id, purchase_type } = req.body as {
      purchase_id: number;
      purchase_type: boolean
    };
    const result = await pool.query('SELECT * FROM update_purchase($1, $2);', [purchase_id,purchase_type]);

    if (result.rows.length === 0) {
      res.status(404).json({ error: '구매 내역을 찾을 수 없습니다.' });
      return;
    }

    res.status(200).json({ message: '구매 내역이 취소되었습니다.', data: result.rows[0] });
  } catch (error) {
    console.error('Error creating ticket purchase:', error);
    res.status(500).json({ error: '구매 내역을 수정하는데 실패했습니다.' });
  }
};
