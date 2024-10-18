import { Request, Response } from 'express';
import pool from "../database/db";
import { UsageParams, TransferTickets, PaggingTicketIssu } from '../types/ticketUsage';

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

/*구매기록페이지 api*/

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
    const result = await pool.query('SELECT * FROM update_purchase($1, $2);', [purchase_id, purchase_type]);

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

/*사무실 페이지 관련 api*/

//사무실 식권개수 조회(관리자메인) api
export const getOfficeTicketList = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await pool.query('SELECT * FROM read_office_ticket_amounts()');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};
//사무실 상세페이지 식권개수 api
export const getOfficeTicketAmount = async (req: Request, res: Response): Promise<void> => {
  const officeName = req.query.officeName as string;
  console.log(officeName)
  try {
    const result = await pool.query('SELECT * FROM read_office_company_ticket_amounts($1)', [officeName]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

//사무실 식권 사용기록 페이징 api
export const getOfficeUsageList = async (req: Request, res: Response): Promise<void> => {
  const queryParams: UsageParams = {
    pageNum: Number(req.query.pageNum) || 1, // 숫자로 변환
    officeName: (req.query.officeName as string) || null,
    useDate: req.query.usedDate ? new Date(req.query.usedDate as string) : null,
    userName: (req.query.userName as string) || null,
    userDepartment: (req.query.userDepartment as string) || null,
    usageTime: (req.query.usageTime as string) || null,
    usageType: req.query.usageType === 'true', // boolean 변환
  }
  try {
    const result = await pool.query('SELECT * FROM paging_usage($1, $2, $3, $4, $5, $6, $7)',
      [
        queryParams.pageNum,
        queryParams.officeName,
        queryParams.useDate,
        queryParams.userName,
        queryParams.userDepartment,
        queryParams.usageTime,
        queryParams.usageType
      ]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
}

//사무실 식권 지급 api
export const transferTickets = async (req: Request, res: Response): Promise<void> => {

  const { date, company, office, quantity, ticketType }: TransferTickets = req.body;

  try {
    const result = await pool.query('SELECT * FROM insert_issuances($1, $2, $3, $4, $5)', [date, company, office, quantity, ticketType]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
}

//사무실 식권 지급기록 조회 api
export const paggingTicketIssu = async (req: Request, res: Response): Promise<void> => {
  const {pageNum, officeName}: PaggingTicketIssu = req.body;
  
  try {
    const result = await pool.query('SELECT * FROM paging_issu($1, $2)', [pageNum,officeName]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
}