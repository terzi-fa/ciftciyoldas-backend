import { Controller, Get, Param, UseGuards, Request } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

interface FieldAnalytics {
  field: any;
  soilTrends: {
    ph: Array<{ date: Date; value: number }>;
    nitrogen: Array<{ date: Date; value: number }>;
    phosphorus: Array<{ date: Date; value: number }>;
    potassium: Array<{ date: Date; value: number }>;
  };
  growthTrends: {
    height: Array<{ date: Date; value: number }>;
    health: Array<{ date: Date; value: number }>;
    diseaseIncidence: Array<{ date: Date; value: number }>;
  };
}

@Controller('analytics')
@UseGuards(JwtAuthGuard)
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('field/:fieldId')
  getFieldAnalytics(@Param('fieldId') fieldId: string, @Request() req) {
    return this.analyticsService.getFieldAnalytics(req.user.id, +fieldId);
  }
} 