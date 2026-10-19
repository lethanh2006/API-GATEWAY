import { HttpService } from '@nestjs/axios';
import { Inject, Injectable, Scope } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { REQUEST } from '@nestjs/core';

import { UpstreamClient } from '../../common/http/upstream-client';
import type {
  GatewayUser,
  RequestWithContext,
} from '../../common/interfaces/request-context.interface';
import { InternalRequestSignatureService } from '../../common/security/internal-request-signature.service';
import type { CreateScheduleRequestDto } from './dto/create-request.dto';
import type {
  BulkApproveDto,
  RejectRequestDto,
  ScanAttendanceDto,
  UpdatePolicyDto,
  UpdateScheduleEntriesDto,
} from './dto/update-entries.dto';
import type { CreateWorkRequestDto } from './dto/work-request.dto';

type QueryParams = Record<string, string>;

const SCHEDULE = '/api/workschedule/schedule';
const ATTENDANCE = '/api/workschedule/attendance';
const POLICY = '/api/workschedule/policy';
const WORK_REQUESTS = '/api/workschedule/requests';

@Injectable({ scope: Scope.REQUEST })
export class WorkscheduleService {
  private readonly upstream: UpstreamClient;

  constructor(
    httpService: HttpService,
    configService: ConfigService,
    @Inject(REQUEST) request: RequestWithContext,
    signatureService: InternalRequestSignatureService,
  ) {
    this.upstream = new UpstreamClient({
      httpService,
      signatureService,
      request,
      service: 'workschedule',
      baseUrl: configService.get<string>(
        'WORKSCHEDULE_SERVICE_URL',
        'http://localhost:5004',
      ),
      label: 'Dịch vụ lịch làm việc',
    });
  }

  getPendingRequests(query: QueryParams, user: GatewayUser) {
    return this.upstream.get(`${SCHEDULE}/pending`, { params: query, user });
  }

  getAllRequests(query: QueryParams, user: GatewayUser) {
    return this.upstream.get(`${SCHEDULE}/all`, { params: query, user });
  }

  approveRequest(id: string, user: GatewayUser) {
    return this.upstream.post(
      `${SCHEDULE}/requests/${encodeURIComponent(id)}/approve`,
      undefined,
      { user },
    );
  }

  rejectRequest(id: string, dto: RejectRequestDto, user: GatewayUser) {
    return this.upstream.post(
      `${SCHEDULE}/requests/${encodeURIComponent(id)}/reject`,
      dto,
      { user },
    );
  }

  bulkApprove(dto: BulkApproveDto, user: GatewayUser) {
    return this.upstream.post(`${SCHEDULE}/requests/bulk-approve`, dto, {
      user,
    });
  }

  getHeatmap(query: QueryParams, user: GatewayUser) {
    return this.upstream.get(`${SCHEDULE}/heatmap`, { params: query, user });
  }

  scanAttendance(dto: ScanAttendanceDto, user: GatewayUser) {
    return this.upstream.post(`${ATTENDANCE}/scan`, dto, { user });
  }

  getMyAttendance(query: QueryParams, user: GatewayUser) {
    return this.upstream.get(`${ATTENDANCE}/my`, { params: query, user });
  }

  generateQrToken(user: GatewayUser) {
    return this.upstream.post(`${ATTENDANCE}/qr/generate`, undefined, {
      user,
    });
  }

  getTodayAttendance(user: GatewayUser) {
    return this.upstream.get(`${ATTENDANCE}/today`, { user });
  }

  getReport(query: QueryParams, user: GatewayUser) {
    return this.upstream.get(`${ATTENDANCE}/report`, { params: query, user });
  }

  getPolicy() {
    return this.upstream.get(POLICY);
  }

  updatePolicy(dto: UpdatePolicyDto, user: GatewayUser) {
    return this.upstream.patch(POLICY, dto, { user });
  }

  getMySchedules(query: QueryParams, user: GatewayUser) {
    return this.upstream.get(`${SCHEDULE}/my`, { params: query, user });
  }

  getMonthlyOverview(month: string, user: GatewayUser) {
    return this.upstream.get(`${SCHEDULE}/monthly-overview`, {
      params: { month },
      user,
    });
  }

  createRequest(dto: CreateScheduleRequestDto, user: GatewayUser) {
    return this.upstream.post(`${SCHEDULE}/requests`, dto, { user });
  }

  resubmitRequest(
    id: string,
    dto: UpdateScheduleEntriesDto,
    user: GatewayUser,
  ) {
    return this.upstream.post(
      `${SCHEDULE}/requests/${encodeURIComponent(id)}/resubmit`,
      dto,
      { user },
    );
  }

  getRequestInfo(id: string, user: GatewayUser) {
    return this.upstream.get(`${SCHEDULE}/requests/${encodeURIComponent(id)}`, {
      user,
    });
  }

  updateEntries(id: string, dto: UpdateScheduleEntriesDto, user: GatewayUser) {
    return this.upstream.patch(
      `${SCHEDULE}/requests/${encodeURIComponent(id)}`,
      dto,
      { user },
    );
  }

  deleteRequest(id: string, user: GatewayUser) {
    return this.upstream.delete(
      `${SCHEDULE}/requests/${encodeURIComponent(id)}`,
      { user },
    );
  }

  getMyWorkRequestStats(month: string, user: GatewayUser) {
    return this.upstream.get(`${WORK_REQUESTS}/my/stats`, {
      params: month ? { month } : undefined,
      user,
    });
  }

  getMyWorkRequests(query: QueryParams, user: GatewayUser) {
    return this.upstream.get(`${WORK_REQUESTS}/my`, { params: query, user });
  }

  createWorkRequest(dto: CreateWorkRequestDto, user: GatewayUser) {
    return this.upstream.post(WORK_REQUESTS, dto, { user });
  }

  cancelWorkRequest(id: string, user: GatewayUser) {
    return this.upstream.patch(
      `${WORK_REQUESTS}/${encodeURIComponent(id)}/cancel`,
      undefined,
      { user },
    );
  }

  getAdminWorkRequests(query: QueryParams, user: GatewayUser) {
    return this.upstream.get(`${WORK_REQUESTS}/admin`, {
      params: query,
      user,
    });
  }

  approveWorkRequest(id: string, user: GatewayUser) {
    return this.upstream.post(
      `${WORK_REQUESTS}/${encodeURIComponent(id)}/approve`,
      undefined,
      { user },
    );
  }

  rejectWorkRequest(id: string, dto: RejectRequestDto, user: GatewayUser) {
    return this.upstream.post(
      `${WORK_REQUESTS}/${encodeURIComponent(id)}/reject`,
      dto,
      { user },
    );
  }
}
