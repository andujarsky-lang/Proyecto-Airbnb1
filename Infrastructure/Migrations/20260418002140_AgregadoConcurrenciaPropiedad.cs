using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AgregadoConcurrenciaPropiedad : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<byte[]>(
                name: "RowVersion",
                table: "Propiedades",
                type: "rowversion",
                rowVersion: true,
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "UltimaActividad",
                table: "Propiedades",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.CreateIndex(
                name: "IX_Reservas_PropiedadId",
                table: "Reservas",
                column: "PropiedadId");

            migrationBuilder.CreateIndex(
                name: "IX_Reseñas_PropiedadId",
                table: "Reseñas",
                column: "PropiedadId");

            migrationBuilder.AddForeignKey(
                name: "FK_Reseñas_Propiedades_PropiedadId",
                table: "Reseñas",
                column: "PropiedadId",
                principalTable: "Propiedades",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Reservas_Propiedades_PropiedadId",
                table: "Reservas",
                column: "PropiedadId",
                principalTable: "Propiedades",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Reseñas_Propiedades_PropiedadId",
                table: "Reseñas");

            migrationBuilder.DropForeignKey(
                name: "FK_Reservas_Propiedades_PropiedadId",
                table: "Reservas");

            migrationBuilder.DropIndex(
                name: "IX_Reservas_PropiedadId",
                table: "Reservas");

            migrationBuilder.DropIndex(
                name: "IX_Reseñas_PropiedadId",
                table: "Reseñas");

            migrationBuilder.DropColumn(
                name: "RowVersion",
                table: "Propiedades");

            migrationBuilder.DropColumn(
                name: "UltimaActividad",
                table: "Propiedades");
        }
    }
}
