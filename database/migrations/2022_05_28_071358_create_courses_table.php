<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('courses', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->boolean('certificate')->default(false);
            $table->string('thumbnail')->nullable();
            $table->enum('type', ['premium', 'freemium', 'free'])->default('free');
            $table->enum('status', ['draft', 'published'])->default('published');
            $table->integer("price")->default(0);
            $table->enum('level', ['all-level', 'beginner', 'intermediate', 'advance'])->default('all-level');
            $table->longText('description')->nullable();
            $table->foreignId('mentor_id')->constrained('mentors')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('courses');
    }
};
